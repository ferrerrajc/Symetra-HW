import { adminApi } from "./controllers/admin";
import express from "express";

const app = express();

const port = 7070;

app.use(express.json());

app.use("/admin", adminApi);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})