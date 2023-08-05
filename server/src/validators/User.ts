import { Type, type } from "arktype"
import { User } from "../types"

export const userValidator: Type<User> = type({
    id: "uuid",
    name: "string"
})