import {z} from "zod/v4";
import {roleEnumWithAll} from "@/lib/schema/role";
import { infiniteScroll } from "@/lib/schema/page";

export const banUserSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    reason: z.string().max(500, "Reason must be at most 500 characters long").optional(),
    banExpires:z.date().refine((date) => date > new Date(), { message: "Ban expiration date must be in the future" }).optional(),
});

export type BanUserSchema = z.infer<typeof banUserSchema>;

export const filterUserSchema = z.object({
    search: z.string().optional(),
    role: roleEnumWithAll,
    isBanned:z.enum(['banned','not_banned','all']),
});

export type FilterUserSchema = z.infer<typeof filterUserSchema>;

export const filterUserWithInfiniteScrollSchema = filterUserSchema.extend(infiniteScroll.shape);
export type FilterUserWithInfiniteScrollSchema = z.infer<typeof filterUserWithInfiniteScrollSchema>;
