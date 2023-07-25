import { LocalDB, LocalKV } from "./utilities";


type UnionCreate = {
    name: string,
    owner_name: string,
    date: string,
    address: string,

    network: {
        name: string,
        chain_id: number
    }

}

type JoinRequest = {address: string, userAddress: string}



export let created_unions = new LocalDB<UnionCreate>("created_unions");
export let joined_unions = new LocalDB<string>("joined_unions");
export let join_requests = new LocalDB<JoinRequest>("join_requests");
export let my_union = new LocalKV("my_union_address");
