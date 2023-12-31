import { ethers, ContractFactory } from "ethers";
import { CreditUnion } from "../artifacts/typechain/contracts/types";
import contract_built from "../artifacts/build";


let singleton: Contract | null = null;


const approvable = {
    DEPOSIT: 0,
    CREDIT: 1,
    REPAYMENT: 2        
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
            contract_built.abi, 
            this.signer
        ) as CreditUnion;

        this.address = address;
        singleton = this;
        connection.requestMetamask();
    }


    async getData() {
        let totalDeposit:   number = await this.contract.totalDeposit();
        let ownerName:      string = await this.contract.ownerName();
        let createdAt:      number = (await this.contract.createdAt()).toNumber();
        let name:           string = await this.contract.name();
        let members:  CreditUnion.MemberStruct[] = await this.contract.getMembers();
        return { totalDeposit, ownerName, name, members, createdAt }
    }
    
    // members
    async getMember(address: string) {
        let result = await this.contract.members(address);
        return result;
    }
    
    async getMembers() {
        return await this.contract.getMembers(); 
    }
    
    async getMemberApprovals(address: string) {
        return await this.contract.memberApprovedList(address);
    }

    async getMembersByAddresses(addresses: string[]) {
        return await this.contract.getMembersByAddresses(addresses);
    }

    // deposit
    async createDeposit(quantity: number) {
        await this.contract.createDeposit(quantity, Date.now());
    }
    
    async approveDeposit(id: number) {
        await this.contract.approve(approvable.DEPOSIT, id, Date.now());
    }
    
    async getDepositApprovals(id: number) {
        return await this.contract.depositApprovedList(id);
    }

    async getDeposits() {
        return await this.contract.getDeposits();
    }
    
    // join
    async createJoin(name: string) { 
        await this.contract.createJoin(name); 
    }
    
    async approveJoin(address: string) {
        await this.contract.approveJoin(address, Date.now());
    }
    
    async getJoinRequests() {
        let members = await this.getMembers();
        return members.filter(m => !m.confirmed);
    }

    // credits
    async createCredit(amount: number, term: number) {
        await this.contract.createCredit(amount, term, Date.now());
    }

    async approveCredit(id: number) {
        await this.contract.approve(approvable.CREDIT, id, Date.now());
    }

    async getCredits() {
        return await this.contract.getCredits(); 
    }

    async getCredit(id: number) {
        return await this.contract.credits(id);
    }

    async getCreditApprovals(id: number) {
        return this.contract.creditApprovedList(id);
    }

    // repayment
    async createRepayment(creditId: number, amount: number, month: number) {
        await this.contract.createRepayment(creditId, amount, month, Date.now());
    }

    async approveRepayment(id: number) {
        await this.contract.approve(approvable.REPAYMENT, id, Date.now());
    }

    async getRepaymentsByCredit(creditId: number) { 
        return await this.contract.getRepaymentsByCredit(creditId); 
    }

    async getRepaymentApprovals(id: number) {
        return await this.contract.repaymentApprovedList(id);
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

    const deployedContract = await contractFactory.deploy(
        union_name, 
        ownerName, 
        members, 
        memberNames,
        Date.now()        
    );
    await deployedContract.deployed();

    return await deployedContract.address;
}


/**
 * checks if name is already in contract members
 */
export async function checkRequestStatus(address: string, userAddress: string): Promise<boolean> {
    let contract = new Contract(address);
    

    try {
        let member = await contract.getMember(userAddress);
        return member.confirmed;
    } catch(e) {
        return false;
    }    
}


type JoinRequest = {address: string, userAddress: string}


export async function getJoinRequests(requests: JoinRequest[]) {
    let unions: any = [];

    for (let i = 0; i < requests.length; i++) {
        let request = requests[i];
        let contract = new Contract(request.address);

        try {
            let data = await contract.getData();
            let is_joined = await checkRequestStatus(request.address, request.userAddress);

            data["joined"] = is_joined;
            data["address"] = request.address;

            unions.push(data);
            unions = unions.reverse();            
        } catch (e) { }
    }

    return unions;

}
