export interface Coupon {
    code: string
    afterTransactions: number;
    maxUses: number;
    discountPercent: number;
}