import { ethers } from "ethers";



export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any;


export const connection = {
    getProvider() {
        return new ethers.providers.EtherscanProvider("sepolia", "T4SSWAURWMV6X2T1EED11HDIWKT28KP25W");
    },

    async requestAccount() {
        let provider = this.getProvider();
        await provider?.send("eth_requestAccounts", []);
    },

    getSigner() {
        let provider = this.getProvider();
        return provider?.getSigner();
    }
}


export async function getHistory(address: string) {
    let provider = connection.getProvider();
    let history = provider.getHistory(address);
    return history;
}

