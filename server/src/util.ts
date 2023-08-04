import { v4 } from "uuid";

export function generateId<T extends { id: string }>(obj: Omit<T, "id">): T {
    return {
        ...obj,
        id: v4()
    } as T
}