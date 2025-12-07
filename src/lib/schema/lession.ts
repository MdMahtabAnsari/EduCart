import { z } from "zod/v4";
import { mediaSchema } from "@/lib/schema/media";
import { Content } from "@tiptap/react";
import { id } from '@/lib/schema/common';
import { infiniteScroll } from "@/lib/schema/page";

export const createLessionSchemaFrontEnd = z.object({
    courseId: z.uuid(),
    sectionId: z.uuid(),
    title: z.string().min(3, "Lession title must be at least 3 characters long").max(100, "Lession title must be at most 100 characters long"),
    media: mediaSchema,
    content: z.custom<Content>().refine((val) => {
        if (typeof val !== "string") return true;

        const wordCount = val.trim().split(/\s+/).length;
        return wordCount >= 200 && wordCount <= 300;
    }, {
        message: "Content must be between 200 and 300 words"
    })
});

export type CreateLessionSchemaFrontEnd = z.infer<typeof createLessionSchemaFrontEnd>;

export const createLessionSchemaBackEnd = createLessionSchemaFrontEnd.omit({
    content: true,
}).extend({
    content: z.string().min(20, "Content must be at least 20 characters long"),
});

export type CreateLessionSchemaBackEnd = z.infer<typeof createLessionSchemaBackEnd>;

export const editLessionSchemaBackEnd = createLessionSchemaBackEnd.omit({ courseId: true }).partial().extend({
    id: id,
});

export type EditLessionSchemaBackEnd = z.infer<typeof editLessionSchemaBackEnd>;

export const editLessionSchemaFrontEnd = createLessionSchemaFrontEnd.omit({ courseId: true }).partial().extend({
    id: id,
});

export type EditLessionSchemaFrontEnd = z.infer<typeof editLessionSchemaFrontEnd>;

export const lessonWithInfiniteScroll = z.object({
    courseId: id,
    sectionId: id,
}).extend(infiniteScroll.shape);

export type LessonWithInfiniteScroll = z.infer<typeof lessonWithInfiniteScroll>;