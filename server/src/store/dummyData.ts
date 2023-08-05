import { commerce, datatype } from "faker";
import { generateId } from "../util";
import { Product, User, Transaction, Coupon } from "../types";

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
    generateId({ userId: users[0].id, productIds: [products[0].id], couponCodes: [] }),
    generateId({ userId: users[0].id, productIds: [products[1].id], couponCodes: [] }),
    generateId({ userId: users[0].id, productIds: [products[2].id], couponCodes: [] }),
    generateId({ userId: users[1].id, productIds: [products[3].id], couponCodes: [] }),
    generateId({ userId: users[1].id, productIds: [products[4].id], couponCodes: [] }),
]

const coupons: Coupon[] = [
    { afterTransactions: 3, code: "BIGBUY15", discountPercent: 15, maxUses: 1 }
]

export default { users, products, transactions, coupons }