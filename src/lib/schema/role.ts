import {z} from "zod/v4";

export const roleEnum = z.enum(['admin', 'user', 'teacher']);

export type Role = z.infer<typeof roleEnum>;