import express from "express";
import cors from "cors";
import { InMemoryDB } from "./store/db";
import { CouponStore } from "./store/couponStore";
import { getPublicApi } from "./controllers/public";
import { getAdminApi } from "./controllers/admin";
import dummyData from "./store/dummyData";

const app = express();

// Hard-coded Config
const port = 7070;
const db = new InMemoryDB(dummyData);
const couponStore = new CouponStore(db);

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }))

app.use("/admin", getAdminApi(couponStore));
app.use("/store", getPublicApi(couponStore))

// Expose spec for generated API docs
app.use("/spec", express.static("spec"));

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})