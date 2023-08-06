import createClient from "openapi-fetch";
import { paths } from "@/generated/schema";
import { Transaction } from "@/generated/types";

const { GET, POST } = createClient<paths>({ baseUrl: "http://localhost:7070" });

export function getAllProducts() {
    return GET("/store/products", { params: {} })
}

export function getAllTransactions(userId?: string) {
    return GET("/store/transactions", { params: userId ? { query: { userId }} : {}})
}

export function postTransaction(transaction: Transaction) {
    return POST("/store/transactions", { body: transaction })
}

export function getCoupons(userId?: string) {
    return GET("/store/coupons", { params: userId ? { query: { userId }} : {}})
}

export function getAllUsers() {
    return GET("/admin/users", {})
}
