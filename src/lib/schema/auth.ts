import { z } from "zod/v4";
import { username,password } from "@/lib/schema/common";


export const signInSchema = z.object({
    email: z.email(),
    password
});

export const bio = z.string().max(160, "Bio must be at most 160 characters long")

export const signUpSchema = z.object({
    email: z.email(),
    password,
    name: z.string().min(2, "Name must be at least 2 characters long").max(20, "Name must be at most 20 characters long").regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    image: z.url().optional(),
    username,
    bio:bio.optional() ,
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;