import express from "express";
import { CouponStoreInterface } from "../store/couponStore";
import { transactionValidator } from "../validators/Transaction";

export function getPublicApi(couponStore: CouponStoreInterface) {
    const publicApi = express.Router();

    publicApi.get("/products", async (_req, res) => {
        const products = await couponStore.getAllProducts();
        return res.json(products);
    })

    publicApi.get("/coupons", async (req, res) => {
        const userId = req.query?.userId;
        if (userId && typeof userId === "string") {
            const coupons = await couponStore.getCouponsForUser(userId);
            return res.json(coupons);
        } else {
            const coupons = await couponStore.getAllCoupons();
            return res.json(coupons);
        }
    })

    publicApi.get("/transactions", async (req, res) => {
        const userId = req.query?.userId;
        if (userId && typeof userId === "string") {
            const transactions = await couponStore.getTransactionsByUserId(userId);
            return res.json(transactions);
        } else {
            const transactions = await couponStore.getAllTransactions();
            return res.json(transactions);
        }
    })

    publicApi.post("/transactions", async (req, res) => {
        const { data, problems } = transactionValidator(req.body);

        if (problems) {
            res.status(400).json({ problems });
        } else if (data) {
            try {
                const result = await couponStore.createTransaction(data);
                return res.json(result);
            } catch (error) {
                res.status(400).json({ error });
            }
        }
    })

    return publicApi;
}