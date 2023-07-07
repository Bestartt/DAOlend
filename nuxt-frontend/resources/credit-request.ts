export function approve(id, address: string) {
    // @ts-ignore
    let contract = new Contract(address);
    contract.approveCreditRequest(id)
}


export async function getCreditRequests(address: string) {

    let contract = new Contract(address);
    let immutable_data = await contract.getCreditRequests();
    
    let data = to_mutable(immutable_data);

    for (let i = 0; i < data.length; i++) {
        const addresses = data[i].approvedMembers;
        // @ts-ignore
        data[i].members = getMemberNames(addresses);
        
    }

    return data;
}


export async function getMemberNames(addresses: string[]) {
    let names = [];

    for (let i = 0; i < addresses.length; i++) {
        let contract = new Contract(addresses[i]);
        let member = await contract.getMember(addresses[i]);
        names.push(member.name);                
    }

    return names
}
