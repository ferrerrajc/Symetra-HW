import { Type, type } from "arktype";
import { Coupon } from "../types";

export const couponValidator: Type<Coupon> = type({
    code: "string",
    afterTransactions: "integer>0",
    maxUses: "integer>0",
    discountPercent: "0<number<100"
})