import { z } from "zod/v4";
import { mediaSchema } from "@/lib/schema/media";
import { Content } from "@tiptap/react";
import { CourseLevel } from "@/generated/prisma/enums";
import { pageLimitSchema, infiniteScroll } from "@/lib/schema/page";
import { id } from "@/lib/schema/common";

export const courseSchemaFrontEnd = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long").max(100, "Title must be at most 100 characters long"),
    description: z.custom<Content>().refine((val) => {
        if (typeof val !== "string") return true;

        const wordCount = val.trim().split(/\s+/).length;
        return wordCount >= 200 && wordCount <= 300;
    }, {
        message: "Description must be between 200 and 300 words"
    }),
    media: mediaSchema,
    published: z.boolean(),
    price: z.string().refine((val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 10000;
    }, { message: "Price must be a number between 0 and 10000" }),
    level: z.enum(CourseLevel),
    categories: z.array(z.uuid()).min(1, "At least one category must be selected"),
    offerPrice: z.string().refine((val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 10000;
    }, { message: "Offer price must be a number between 0 and 10000" }).optional(),
    isFree: z.boolean(),
    language: z.array(z.uuid()).min(1, "At least one language must be selected"),
    tags: z.array(z.uuid()).optional(),
});

export type CourseSchemaFrontEnd = z.infer<typeof courseSchemaFrontEnd>;

export const courseSchemaBackEnd = courseSchemaFrontEnd.omit({
    description: true,
}).extend({
    description: z.string().min(20, "Description must be at least 20 characters long"),
});

export type CourseSchemaBackEnd = z.infer<typeof courseSchemaBackEnd>;

export const filteredCoursesSchema = z.object({
    search: z.string().optional(),
    categories: z.array(z.uuid()),
    tags: z.array(z.uuid()),
    languages: z.array(z.uuid()),
    free: z.enum(['FREE', 'PAID', 'ALL']),
    level: z.enum([...Object.values(CourseLevel), 'ALL']),
    priceRange: z.array(z.number()).length(2),
    ratings: z.number().min(0).max(5),
    enrolled: z.boolean(),
    instructors: z.array(z.uuid()),
});

export type FilteredCoursesSchema = z.infer<typeof filteredCoursesSchema>;

export const filteredCoursesSchemaWithPageLimit = filteredCoursesSchema.extend({
    pageLimit: pageLimitSchema,
});

export const filterCourseSchemaWithInfiniteScroll = filteredCoursesSchema.extend(infiniteScroll.shape);

export const editCourseSchemaFrontEnd = courseSchemaFrontEnd.partial().extend({
    id: id,
});

export type EditCourseSchemaFrontEnd = z.infer<typeof editCourseSchemaFrontEnd>;

export const editCourseSchemaBackEnd = courseSchemaBackEnd.partial().extend({
    id: id,
});

export type EditCourseSchemaBackEnd = z.infer<typeof editCourseSchemaBackEnd>;









