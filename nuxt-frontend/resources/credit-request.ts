import { CreditUnion } from './../artifacts/typechain/contracts/types';


export function approve(id, address: string) {
    // @ts-ignore
    let contract = new Contract(address);
    contract.approveCreditRequest(id)
}


type CreditRequest = CreditUnion.CreditRequestStruct & { members: string[] }


export async function getCreditRequests(address: string) {

    let contract = new Contract(address);
    let immutable_data = await contract.getCreditRequests();
    
    let data: CreditRequest[] = to_mutable(immutable_data);

    for (let i = 0; i < data.length; i++) {
        const addresses = data[i].approvedMembers;
        // @ts-ignore
        data[i].members = await getMemberNames(addresses, address);
    }

    return data;
}


export async function getMemberNames(membersAddresses: string[], contractAddress: string) {
    let names = [];
    for (let i = 0; i < membersAddresses.length; i++) {
        let contract = new Contract(contractAddress);
        let member = await contract.getMember(membersAddresses[i]);
        names.push(member.name);
    }

    return names
}
