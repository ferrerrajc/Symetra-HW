import { Type, arrayOf, type } from "arktype";
import { Transaction } from "../types";

export const transactionValidator: Type<Transaction> = type({
    id: "uuid",
    userId: "uuid",
    productIds: arrayOf("uuid"),
    couponCodes: arrayOf("string")
})