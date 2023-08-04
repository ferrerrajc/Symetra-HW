import { Coupon } from "../types/Coupon";
import { Product } from "../types/Product";
import { Transaction } from "../types/Transaction";
import { User } from "../types/User";

interface SeedData {
    users: User[]
    products: Product[]
    coupons: Coupon[]
    transactions: Transaction[]
}

const emptySeedData: SeedData = {
    users: [],
    products: [],
    coupons: [],
    transactions: [],
}

export class InMemoryDB {
    private users: { [id: string]: User };
    private products: { [id: string]: Product };
    private coupons: { [code: string]: Coupon };
    private transactions: { [id: string]: Transaction } = {};

    constructor({ users, products, coupons, transactions }: SeedData = emptySeedData) {
        this.users = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {})
        this.products = products.reduce((acc, product) => ({ ...acc, [product.id]: product }), {})
        this.coupons = coupons.reduce((acc, coupon) => ({ ...acc, [coupon.code]: coupon }), {})
        this.transactions = transactions.reduce((acc, transaction) => ({ ...acc, [transaction.id]: transaction }), {})
    }

    getAllUsers() {
        return Promise.resolve(this.users);
    }

    getAllProducts() {
        return Promise.resolve(this.products);
    }

    getAllCoupons() {
        return Promise.resolve(this.coupons);
    }
    getCouponByCode(code: string) {
        if (this.coupons[code]) {
            return Promise.resolve(this.coupons[code]);
        }
        return Promise.reject(`Coupon code "${code}" not found.`);
    }
    addCoupon(coupon: Coupon) {
        if (this.coupons[coupon.code]) {
            return Promise.reject(`Coupon already exists with code "${coupon.code}"`);
        }
        this.coupons[coupon.code] = coupon;
        return Promise.resolve(coupon);
    }
    updateCoupon(coupon: Coupon) {
        if (this.coupons[coupon.code]) {
            this.coupons[coupon.code] = coupon;
            return Promise.resolve(coupon);
        }
        return Promise.reject(`Coupon code "${coupon.code}" not found.`);
    }
    deleteCoupon(coupon: Coupon) {
        return Promise.resolve(delete this.coupons[coupon.code]);
    }

    getAllTransactions() {
        return Promise.resolve(this.transactions);
    }
    getTransactionsByUserId(userId: string) {
        return this.getAllTransactions()
            .then(Object.values)
            .then((allTransactions: Transaction[]) => allTransactions
                .filter(transaction => transaction.user.id === userId)
            )
    }
    addTransaction(transaction: Transaction) {
        this.transactions[transaction.id] = transaction;
        return Promise.resolve(transaction);
    }
}