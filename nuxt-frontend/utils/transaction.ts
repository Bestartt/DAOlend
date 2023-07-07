import { ethers } from "ethers"

import contract_built from "../artifacts/build";



export type TransactionType = {
    blockNumber: string,
    timeStamp: string,
    hash: string,
    nonce: string,
    blockHash: string,
    transactionIndex: string,
    from: string,
    to: string,
    value: string,
    gas: string,
    gasPrice: string,
    isError: string,
    txreceipt_status: string,
    input: string,
    contractAddress: string,
    cumulativeGasUsed: string,
    gasUsed: string,
    confirmations: string,
    methodId: string,
    functionName: string
}


export type TransactionInfo = {
    methodName: string,
    argument: any,
    from: string,
    to: string,
    timeStamp: number
};



export class Transaction {
    iface: ethers.utils.Interface;
    transaction: TransactionType;

    constructor (transaction: TransactionType) {
        const abi = contract_built.abi;
        this.iface = new ethers.utils.Interface(abi);
        this.transaction = transaction;
    }

    get_function_name() {
        try {
            return this.iface.getFunction(this.transaction.methodId).name;
        } catch(e) {
            return null
        }
    }

    get_function_params() {
        let function_name = this.get_function_name();

        if (function_name == null) {
            return []
        }

        let data =  this.iface.decodeFunctionData(
            function_name, 
            this.transaction.input
        );

        debugger;

        return data;
    }

    info(): TransactionInfo {
        let t = this.transaction;
        return {
            methodName: this.get_function_name(),
            argument: this.get_function_params(),          
            from: t.from,
            to: t.to,
            timeStamp: Number(t.timeStamp),
        }
    }

}



export function get_transactions_info(transactions: TransactionType[]) {
    let result: ReturnType<Transaction['info']>[] = [];

    transactions.map((t) => {
        let cls = new Transaction(t);
        result.push(cls.info());
    })

    return result;

}
