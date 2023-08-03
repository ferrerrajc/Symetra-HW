import express from "express";
import { inspect } from "util";

export const adminApi = express.Router();

interface CouponsRequestBody {
    uses: number
}
interface CouponsResponseBody {
    couponCode: string
}

adminApi.post<CouponsRequestBody, CouponsResponseBody>("/coupon", (req, res) => {
    console.log(inspect(req.body));
    res.send({ couponCode: "asdf" });
})
