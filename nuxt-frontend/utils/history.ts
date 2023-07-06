import { LocalDB } from "./localdb";


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



export let created_unions = new LocalDB<UnionCreate>("created_unions");
