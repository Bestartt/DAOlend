export function set_my_union(address: string) {
    localStorage.setItem("my_union_address", address);
}

export function get_my_union() {
    return localStorage.getItem("my_union_address");
}


export function set_joined_union(address: string) {
    let unions = get_joined_unions()
    unions.push(address);

    localStorage.setItem('joined_unions', JSON.stringify(unions))
}


export function get_joined_unions(): string[] {
    let unions_json = localStorage.getItem("joined_unions");

    if (unions_json == null) {
        return []
    } else {
        return JSON.parse(unions_json)
    }

}


type JoinRequest = {address: string, username: string}


export function set_join_request(address: string, username: string) {
    let requests = get_join_requests();
    requests?.push({
        address: address,
        username: username
    });

    localStorage.setItem('join_requests', JSON.stringify(requests));
}


export function get_join_requests(): JoinRequest[] {
    let requests_json =  localStorage.getItem('join_requests');

    if (requests_json == null) {
        return []
    } else {
       return JSON.parse(requests_json); 
    }
}
