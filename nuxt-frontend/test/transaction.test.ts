import { assert, test, expect } from "vitest";

import { test_transaction, expected } from "./fixtures";

import { Transaction } from "utils/transaction";  


let transaction = new Transaction(test_transaction);



test("function name", () => {
    assert.equal(transaction.get_function_name(), "deposit");
})

test("function param value", () => {
    // @ts-ignore
    assert.equal(transaction.get_function_params(), 1200);
})


test("get transaction info", () => {
    assert.deepEqual(transaction.info(), expected);
})
