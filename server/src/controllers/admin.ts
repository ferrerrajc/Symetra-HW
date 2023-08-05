import express from "express";
import { CouponStore } from "../store/couponStore";
import { couponValidator } from "../validators/Coupon";

export function getAdminApi(couponStore: CouponStore) {
    const adminApi = express.Router();

    adminApi.post("/coupon", async (req, res) => {
        const { data, problems } = couponValidator(req.body);

        if (problems) {
            res.status(400).json({ problems });
        } else if (data) {
            try {
                const result = await couponStore.createCoupon(data);
                return res.json(result);
            } catch (error) {
                res.status(500).json({ error });
            }
        }
    })

    adminApi.get("/users", async (_req, res) => {
        try {
            const users = await couponStore.getAllUsers();
            return res.json(users);
        } catch (error) {
            res.status(500).json({ error });
        }
    })

    return adminApi;
}
