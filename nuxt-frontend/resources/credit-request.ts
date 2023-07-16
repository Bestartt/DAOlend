import { CreditUnion } from './../artifacts/typechain/contracts/types';


export function approve(id, address: string) {
    // @ts-ignore
    let contract = new Contract(address);
    contract.approveCredit(id)
}


type CreditRequest = CreditUnion.CreditStruct & { members: string[] }


export async function getCreditRequests(address: string) {

    let contract = new Contract(address);
    let immutable_data = await contract.getCredits();
    
    let data: CreditRequest[] = to_mutable(immutable_data);
    data = data.filter(c => !c.confirmed);

    for (let i = 0; i < data.length; i++) {
        const addresses = data[i].approvedMembers;
        // @ts-ignore
        data[i].members = await contract.getMembersByAddresses(addresses);
    }

    return data;
}
