import { Coupon, Transaction, Product, User } from "../types";
import { InMemoryDB } from "./db";

export interface CouponStoreInterface {
    createCoupon(coupon: Coupon): Promise<Coupon>
    getAllCoupons(): Promise<Coupon[]>
    getCouponByCode(couponCode: string): Promise<Coupon>
    deleteCoupon(couponCode: string): Promise<boolean>
    getCouponsForUser(userId: string): Promise<Coupon[]>

    getAllTransactions(): Promise<Transaction[]>
    getTransactionsByUserId(userId: string): Promise<Transaction[]>
    createTransaction(transaction: Transaction): Promise<Transaction>

    getAllProducts(): Promise<Product[]>

    getAllUsers(): Promise<User[]>
}

export class CouponStore implements CouponStoreInterface {
    private redeemedCouponCodes: { [couponId: string]: string[] } = {}
    private remainingUses: { [couponCode: string]: number } = {}

    constructor(private db: InMemoryDB) { 
        this.initialize()
    }

    createCoupon(coupon: Coupon): Promise<Coupon> {
        return this.db.addCoupon(coupon)
            .then(addedCoupon => {
                this.remainingUses[addedCoupon.code] = addedCoupon.maxUses;
                this.redeemedCouponCodes[addedCoupon.code] = [];
                return addedCoupon;
            })
    }
    getAllCoupons(): Promise<Coupon[]> {
        return this.db.getAllCoupons()
            .then(coupons => Object.values(coupons))
    }
    getCouponByCode(couponCode: string): Promise<Coupon> {
        return this.db.getCouponByCode(couponCode);
    }
    deleteCoupon(couponCode: string): Promise<boolean> {
        return this.getCouponByCode(couponCode)
            .then(coupon => this.db.deleteCoupon(coupon))
    }
    getCouponsForUser(userId: string): Promise<Coupon[]> {
        return this.getAllCoupons()
            .then(coupons => this.getTransactionsByUserId(userId)
                .then(transactions =>
                    coupons.filter(coupon => {
                        return this.remainingUses[coupon.code] > 0
                            && transactions.length >= coupon.afterTransactions
                            && !this.redeemedCouponCodes[coupon.code].includes(userId)
                    })
                ))
    }

    getAllTransactions(): Promise<Transaction[]> {
        return this.db.getAllTransactions()
            .then(transactions => Object.values(transactions))
    }
    getTransactionsByUserId(userId: string): Promise<Transaction[]> {
        return this.getAllTransactions()
            .then(transactions => transactions.filter(transaction => transaction.userId === userId))
    }
    createTransaction(transaction: Transaction): Promise<Transaction> {
        return this.db.addTransaction(transaction).then(createdTransaction => {
            createdTransaction.couponCodes.forEach(couponCode => this.useCoupon(transaction.userId, couponCode))
            return createdTransaction;
        })
    }

    getAllProducts(): Promise<Product[]> {
        return this.db.getAllProducts()
            .then(products => Object.values(products))
    }

    getAllUsers(): Promise<User[]> {
        return this.db.getAllUsers()
            .then(users => Object.values(users))
    }

    private useCoupon(userId: string, couponCode: string) {
        if (this.redeemedCouponCodes[couponCode]) {
            this.redeemedCouponCodes[couponCode].push(userId);
        } else {
            this.redeemedCouponCodes[couponCode] = [userId];
        }

        if (this.remainingUses[couponCode]) {
            this.remainingUses[couponCode] -= 1;
        } else if (this.remainingUses[couponCode] !== 0) {
            // shouldn't normally happen
            this.getCouponByCode(couponCode).then(coupon => {
                this.remainingUses[couponCode] = coupon.maxUses;
            }).catch(e => console.warn("Failed to get coupon in `useCoupon`", e))
        }
    }

    private initialize() {
        return this.getAllCoupons()
            .then(coupons => {
                return this.getAllTransactions()
                    .then(transactions => {
                        coupons.forEach(coupon => {
                            const uses = transactions.filter(transaction => transaction.couponCodes.includes(coupon.code));

                            this.remainingUses[coupon.code] = Math.max(0, coupon.maxUses - uses.length);
                            this.redeemedCouponCodes[coupon.code] = uses.map(transaction => transaction.userId);
                        })
                    })
            })
    }
}