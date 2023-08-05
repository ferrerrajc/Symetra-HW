import { arrayOf, type } from "arktype";
import { couponValidator } from "./Coupon";
import { productValidator } from "./Product";

export const cartValidator = type({
    products: arrayOf(productValidator),
    coupons: arrayOf(couponValidator),
})