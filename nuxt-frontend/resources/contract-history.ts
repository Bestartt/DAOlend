import { TransactionType, get_transactions_info } from "~/utils/transaction";



const ETHERSCAN = {
    sepolia: "https://api-sepolia.etherscan.io/api/",
    mainnet: "https://api.etherscan.io/",
    goerli: "https://api-goerli.etherscan.io/"
}

const ETHERSCAN_APIKEY = "T4SSWAURWMV6X2T1EED11HDIWKT28KP25W"


type networks = "sepolia" | "goerli" | "homestead"


export const actions_dict = {
    createDeposit: "deposit is created",
    createJoin: "request for membership is created",
    approveJoin: "request for membership is comfirmed",
    createCredit: "loan application is created",
    approveCredit: "credit request confirmation",
    createRepayment: "repayment is created",
    approve: "approval",
    null: "organization is created"
}


export const NETWORK_NAMES = ["homestead", "goerli", "sepolia", "mainnet"];


export async function fetch_transactions(contract_address: string): Promise<TransactionType[]> {
    let response = await fetch(`${ETHERSCAN.sepolia}?module=account&action=txlist&address=${contract_address}&apikey=${ETHERSCAN_APIKEY}`);
    let data = await response.json();
    return data.result;
}


export async function get_transactions(contract_address: string) {
    let transactions = await fetch_transactions(contract_address);
    let result = get_transactions_info(transactions);
    return result;

}






