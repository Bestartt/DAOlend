import { ethers, ContractFactory } from "ethers";
import contractInterface from "~/contract";
import { CreditUnion } from "./typechain/types";


export const connection = {
    getProvider() {
        try {
            // @ts-ignore
            const { ethereum } = window;
            if (ethereum) {
                return new ethers.providers.Web3Provider(ethereum);
            }
        } catch(e) {
            console.error(
                `Look's like this function was called
                 before Metamask set ethereum object into global window.
                 Check if you have Metamask browser extension installed
                 `
            );
        }
        return null;
    },

    getHardhatProvider() {
        
    },

    async requestAccount() {
        let provider = this.getProvider();
        await provider?.send("eth_requestAccounts", []);
    },

    getSigner() {
        let provider = this.getProvider();
        return provider?.getSigner();
    }
}


let singleton: Contract | null = null;


export async function contractExists(address: string | null) {
    if (address == null) {
        return false;
    }

    try {
        let provider = connection.getProvider();
        const code = await provider?.getCode(address); 
        return code !== "0x"
        
    } catch(error) {
        console.error("Error occured while checking if contact exists", error);
        return false
    }
}


export class Contract {
    contract: CreditUnion;
    address: string;
    signer;   

    constructor(address: string, signer?) {
        if (singleton && singleton.address == address) {
            return singleton;
        }

        // if signer is not specified use default
        this.signer = typeof signer !== "undefined" ? signer : connection.getSigner();

        this.contract = new ethers.Contract(
            address, 
            contractInterface.abi, 
            this.signer
        ) as CreditUnion;

        this.address = address;
        singleton = this;
        connection.requestAccount();

    }


    async getData() {

        let totalDeposit:   number = await this.contract.totalDeposit();
        let ownerName:      string = await this.contract.ownerName();
        let name:           string = await this.contract.name();
        let memberNames:  string[] = await this.contract.getMemberNames();
        return { totalDeposit, ownerName, name, memberNames }

    }

    async getMemberNames() {
        let members: string[] = await this.contract.getMemberNames();

        return members
    }

    async getMembers() {
        return await this.contract.getMembers();
    }

    async getMember(address: string) {
        let result = await this.contract.members(address);
        return result;
    }

    async getMemberAddresses(): Promise<string[]> {
        return await this.contract.getMembersAddresses();
    }

    async deposit(quantity: number) {

        try {
            await this.contract.deposit(quantity);
        } catch(e) {
            console.error(
                `Couldn't add deposit on 
                contract address: ${this.contract}, 
                quantity: ${quantity}`
            );
            console.error(e);
        }
    }

    async join(name: string) {
        await this.contract.createJoinRequest(name);
    }

    async approveJoinRequest(address: string) {
        let requests: Object[] = await this.contract.getJoinRequests();

        let index = requests.findIndex((request) => request[0] == address);

        await this.contract.approveJoinRequest(index);
    }

    async getJoinRequests() {
        return await this.contract.getJoinRequests();
    }

    async getCredits() {
        return await this.contract.getCredits();
    }

    async repayCredit(id: number, amount: number, month: number) {
        return await this.contract.repay(id, amount, month);
    }

    async createCreditRequest(amount: number, term: number, debtor: string) {
        await this.contract.createCreditRequest(amount, term, debtor);
    }

    async approveCreditRequest(id) {
        await this.contract.approveCreditRequest(id);
    }

    async getCreditRequests() {
        return await this.contract.getCreditRequests();
    }

    async getRepaymentsByCredit(creditId: number) {
        return await this.contract.getRepaymentsByCredit(creditId);
    }

}


export async function createContract(
    union_name: string, 
    members: string[], 
    memberNames: string[], 
    ownerName: string
) {
    const contractFactory = new ContractFactory(
        contractInterface.abi, 
        contractInterface.bytecode, 
        connection.getSigner()
    );

    const deployedContract = await contractFactory.deploy(union_name, members, memberNames, ownerName);
    await deployedContract.deployed();

    return await deployedContract.address;
}


/**
 * checks if name is already in contract members
 */
export async function checkRequestStatus(address: string, name: string): Promise<boolean> {
    let contract = new Contract(address);
    let members = await contract.getMemberNames();
    return members.includes(name);
    
}


type JoinRequest = {address: string, username: string}


export async function getRequestsData(requests: JoinRequest[]) {
    let unions: any = [];

    for (let i = 0; i < requests.length; i++) {
        let request = requests[i];
        let contract = new Contract(request.address);

        let data = await contract.getData();
        let is_joined = await checkRequestStatus(request.address, request.username);

        data["joined"] = is_joined;
        data["address"] = request.address;

        unions.push(data);
        unions = unions.reverse();

    }

    return unions;

}
