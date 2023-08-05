import { Type, type } from "arktype"
import { Product } from "../types";

export const productValidator: Type<Product> = type({
    id: "uuid",
    name: "string",
    price: "number>0"
});