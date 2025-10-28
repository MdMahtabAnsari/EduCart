import { z } from "zod/v4";
import { mediaSchema } from "@/lib/schema/media";
import { Content } from "@tiptap/react";
import { CourseLevel, Language,Currency } from "@/generated/prisma/enums";

export const courseSchemaFrontEnd = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long").max(100, "Title must be at most 100 characters long"),
    description:z.custom<Content>(),
    media:mediaSchema,
    published:z.boolean(),
    price:z.string().refine((val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 10000;
    }, { message: "Price must be a number between 0 and 10000" }),
    instructor:z.array(z.uuid()),
    level:z.enum(CourseLevel),
    categories:z.array(z.uuid()).min(1, "At least one category must be selected"),
    isActive:z.boolean(),
    offerPrice:z.string().refine((val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 10000;
    }, { message: "Offer price must be a number between 0 and 10000" }).optional(),
    isFree:z.boolean(),
    language:z.enum(Language),
    currency:z.enum(Currency),
    tags:z.array(z.uuid()).optional(),
});

export type CourseSchemaFrontEnd = z.infer<typeof courseSchemaFrontEnd>;

export const courseSchemaBackEnd = courseSchemaFrontEnd.omit({
    description:true,
}).extend({
    description:z.string().min(20, "Description must be at least 20 characters long"),
});

export type CourseSchemaBackEnd = z.infer<typeof courseSchemaBackEnd>;