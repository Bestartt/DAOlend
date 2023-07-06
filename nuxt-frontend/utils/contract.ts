import { ethers, ContractFactory } from "ethers";
import { CreditUnion } from "./typechain/types";
import contract_built from "./build";

let singleton: Contract | null = null;



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
            contract_built.abi, 
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

    async getMember(address: string) {
        let result = await this.contract.members(address);
        return result;
    }

    async getMemberAddresses(): Promise<string[]> {
        return await this.contract.getMembersAddresses();
    }

    async getMembers() {return await this.contract.getMembers(); }




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

    async join(name: string) { await this.contract.createJoinRequest(name); }
    async getCredits() {return await this.contract.getCredits(); }
    async repayCredit(id: number, amount: number, month: number) {return await this.contract.repay(id, amount, month);}
    async approveCreditRequest(id) { await this.contract.approveCreditRequest(id); }
    async getCreditRequests() { return await this.contract.getCreditRequests(); }
    async createCreditRequest(amount: number, term: number, debtor: string) { await this.contract.createCreditRequest(amount, term, debtor); }
    async getRepaymentsByCredit(creditId: number) { return await this.contract.getRepaymentsByCredit(creditId); }

    async approveJoinRequest(address: string) {
        let requests: Object[] = await this.contract.getJoinRequests();

        let index = requests.findIndex((request) => request[0] == address);

        await this.contract.approveJoinRequest(index);
    }

}


export async function createContract(
    union_name: string, 
    members: string[], 
    memberNames: string[], 
    ownerName: string
) {
    const contractFactory = new ContractFactory(
        contract_built.abi, 
        contract_built.bytecode, 
        connection.getSigner()
    );

    const deployedContract = await contractFactory.deploy(union_name, members, memberNames, ownerName);
    await deployedContract.deployed();

    return await deployedContract.address;
}
