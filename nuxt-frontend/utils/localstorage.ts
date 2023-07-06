import { LocalDB } from "./localdb";


type JoinRequest = {address: string, username: string}


export let joined_unions = new LocalDB<string>("joined_unions");
export let join_requests = new LocalDB<JoinRequest>("join_requests");



export function set_my_union(address: string) {
    localStorage.setItem("my_union_address", address);
}

export function get_my_union() {
    return localStorage.getItem("my_union_address");
}
