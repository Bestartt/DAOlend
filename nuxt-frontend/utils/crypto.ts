import { ethers } from "ethers";


export const connection = {
    getProvider() {
        try {
            // @ts-ignore
            const { ethereum } = window;
            if (ethereum) {
                return new ethers.providers.Web3Provider(ethereum);
            }
        } catch(e) {
            console.error("Couldn't connect to Metamask or get ethereum object");
        }
        return null;
    },

    async requestAccount() {
        let provider = this.getProvider();
        await provider?.send("eth_requestAccounts", []);
    },

    getSigner() {
        let provider = this.getProvider();
        return provider?.getSigner();
    },

    async getNetwork(): Promise<{name: string, chain_id: number}> {
        let provider: ethers.providers.Web3Provider = this.getProvider();
        let network = await provider.getNetwork();

        return {
            name: network.name,
            chain_id: network.chainId
        }            


    },
}


export async function contractExists(address: string | null) {
    if (address == null) {
        return false;
    }

    try {
        let provider = connection.getProvider();
        const code = await provider?.getCode(address); 
        return code !== "0x"
        
    } catch(error) {
        console.error("Error occured while checking if contact exists", error);
        return false
    }
}


/**
 * checks if name is already in contract members
 */
export async function checkRequestStatus(address: string, name: string): Promise<boolean> {
    let contract = new Contract(address);
    let members = await contract.getMemberNames();
    return members.includes(name);
    
}


type JoinRequest = {address: string, username: string}


export async function getRequestsData(requests: JoinRequest[]) {
    let unions: any = [];

    for (let i = 0; i < requests.length; i++) {
        let request = requests[i];
        let contract = new Contract(request.address);

        try {
            let data = await contract.getData();
            let is_joined = await checkRequestStatus(request.address, request.username);

            data["joined"] = is_joined;
            data["address"] = request.address;

            unions.push(data);
            unions = unions.reverse();            
        } catch (e) { }
    }

    return unions;

}
