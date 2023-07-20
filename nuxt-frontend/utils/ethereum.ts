import { ethers } from "ethers";


export const connection = {
    getProvider() {
        try {
            // @ts-ignore
            return new ethers.providers.Web3Provider(window.ethereum);
        } catch(e) {
            alert("Похоже у вас не установлен Metamask. Пожалуйста скачайте и установите метамаск");
            console.error("Couldn't connect to Metamask or get ethereum object");
        }
        return null;
    },

    async requestMetamask() {
        let provider = this.getProvider();
        await provider?.send("eth_requestAccounts", []);
    },

    async isConnected() {
        let provider = this.getProvider();
        const accounts = await provider.listAccounts();
        return accounts.length > 0;
    },

    getSigner() {
        let provider = this.getProvider();
        return provider?.getSigner();
    },

    async getNetwork() {
        let provider: ethers.providers.Web3Provider = this.getProvider();
        let network = await provider.getNetwork();
        return {
            name: network.name,
            chain_id: network.chainId
        }            
    },

    getCurrentUserAddress() {
        // @ts-ignore
        return window.ethereum.selectedAddress;
    },

    async contractExists(address: string | null) {
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
}
