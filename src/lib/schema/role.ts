import {z} from "zod/v4";

export const roleEnum = z.enum(['admin', 'user', 'teacher']);

export type Role = z.infer<typeof roleEnum>;

export const roleEnumWithAll = z.enum(['admin', 'user', 'teacher', 'all']);

export type RoleWithAll = z.infer<typeof roleEnumWithAll>;