export interface Coupon {
    code: string
    afterTransactions: number;
    maxUses: number;
    discountPercent: number;
}

export interface CouponState {
    coupon: Coupon
    remainingUses: number
}