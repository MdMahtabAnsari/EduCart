import {z} from "zod/v4";

export const banUserSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    reason: z.string().max(500, "Reason must be at most 500 characters long").optional(),
    banExpires:z.date().refine((date) => date > new Date(), { message: "Ban expiration date must be in the future" }).optional(),
});

export type BanUserSchema = z.infer<typeof banUserSchema>;
