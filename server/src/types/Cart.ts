import { Coupon } from "./Coupon";
import { Product } from "./Product";

export interface Cart {
    products: Product[]
    coupons: Coupon[]
}