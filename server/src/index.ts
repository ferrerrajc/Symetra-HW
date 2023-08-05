import express from "express";
import { InMemoryDB } from "./store/db";
import { CouponStore } from "./store/couponStore";
import { getPublicApi } from "./controllers/public";
import { getAdminApi } from "./controllers/admin";
import dummyData from "./store/dummyData";

const app = express();
const port = 7070;

const db = new InMemoryDB(dummyData);
const couponStore = new CouponStore(db);

app.use(express.json());

app.use("/admin", getAdminApi(couponStore));
app.use("/store", getPublicApi(couponStore))

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})