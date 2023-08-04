import { commerce, datatype } from "faker";
import { generateId } from "../util";
import { Coupon } from "../types/Coupon";
import { Product } from "../types/Product";
import { Transaction } from "../types/Transaction";
import { User } from "../types/User";

function createRandomProduct(): Product {
    return generateId({
        name: commerce.product(),
        price: datatype.float({ min: 1.00, max: 100.00, precision: 0.01 })
    })
}

const users: User[] = [
    generateId({ name: "alice" }),
    generateId({ name: "bob" })
]

const products: Product[] = [
    createRandomProduct(),
    createRandomProduct(),
    createRandomProduct(),
    createRandomProduct(),
    createRandomProduct(),
    createRandomProduct(),
    createRandomProduct(),
    createRandomProduct(),
    createRandomProduct(),
    createRandomProduct(),
]

const transactions: Transaction[] = [
    generateId({ user: users[0], products: [products[0]], coupons: [] }),
    generateId({ user: users[0], products: [products[1]], coupons: [] }),
    generateId({ user: users[0], products: [products[2]], coupons: [] }),
    generateId({ user: users[1], products: [products[3]], coupons: [] }),
    generateId({ user: users[1], products: [products[4]], coupons: [] }),
]

const coupons: Coupon[] = [
    { afterTransactions: 3, code: "BIGBUY15", discountPercent: 15, maxUses: 1 }
]

export default { users, products, transactions, coupons }