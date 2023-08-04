import { Coupon } from "./Coupon";
import { Product } from "./Product";
import { User } from "./User";

export interface Transaction {
    id: string
    user: User,
    products: Product[]
    coupons: Coupon[]
}