import { ethers } from "ethers"

import contract_built from "~/utils/build";


const ETHERSCAN = {
    sepolia: "https://api-sepolia.etherscan.io/api/",
    mainnet: "https://api.etherscan.io/",
    goerli: "https://api-goerli.etherscan.io/"
}

const ETHERSCAN_APIKEY = "T4SSWAURWMV6X2T1EED11HDIWKT28KP25W"


type networks = "sepolia" | "goerli" | "mainnet"


export type Transaction = {
    blockNumber: string,
    timestamp: string,
    hash: string,
    nonce: string,
    blockHash: string,
    from: string,
    to: string,
    methodId: string,
    input: string
}


export async function get_transactions_list(address: string, network: networks = "sepolia"): Promise<Transaction[]> {
    let api = ETHERSCAN[network];

    let response = await fetch(`${api}?module=account&action=txlist&address=${address}&apikey=${ETHERSCAN_APIKEY}`);
    let data = await response.json();
    return data.result;

}


export function getMethodName(transaction: Transaction) {
    const abi = contract_built.abi;
    const iface = new ethers.utils.Interface(abi);
    return iface.getFunction(transaction.methodId);

}


export function getTransactionParams(transaction: Transaction) {
    const abi = contract_built.abi;
    const iface = new ethers.utils.Interface(abi);

    let methodName = getMethodName(transaction);

    return iface.decodeFunctionData(methodName, transaction.input);


}