import { Contract } from "~/utils/contract";


export async function useMembers(addresses: Ref<string[] | null>, contractAddress: string) {

    if (addresses == null) {
        return [];
    }

    let contract = new Contract(contractAddress);
    let members = await contract.getMembersByAddresses(addresses.value);

    return members;

}
