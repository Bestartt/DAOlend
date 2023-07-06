export const test_transaction = {
    "blockNumber": "3835430",
    "timeStamp": "1688634096",
    "hash": "0xef64ac6f62fc05df4728231cf40f6654b60afbe489c6519d178a8b53a3f33af9",
    "nonce": "7",
    "blockHash": "0x328c8999b5318ab5fc0caf1217ffc125e7f78f82e1a4144b6524a47581b6fc11",
    "transactionIndex": "21",
    "from": "0xfb465b64094301db5f56b7a65e5e4f9a8f3518f0",
    "to": "0xc91ae277469720885bc7c75a2b18f5ea35a8f390",
    "value": "0",
    "gas": "32888",
    "gasPrice": "1500000011",
    "isError": "0",
    "txreceipt_status": "1",
    "input": "0xb7e8bc9900000000000000000000000000000000000000000000000000000000000004b0",
    "contractAddress": "",
    "cumulativeGasUsed": "1927593",
    "gasUsed": "32888",
    "confirmations": "504",
    "methodId": "0xb7e8bc99",
    "functionName": ""
}


export const expected = {
    methodName: "deposit",
    argument: 1200,
    from: "0xfb465b64094301db5f56b7a65e5e4f9a8f3518f0",
    to: "0xc91ae277469720885bc7c75a2b18f5ea35a8f390",
    timeStamp: 1688634096
}
