import { Cart } from "./Cart";
import { User } from "./User";

export interface Transaction {
    user: User,
    cart: Cart,
    finalized: boolean,
}