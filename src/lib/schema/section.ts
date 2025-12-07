import {z} from "zod/v4";
import { infiniteScroll } from "@/lib/schema/page";
import { id } from "@/lib/schema/common";


export const createSectionSchema = z.object({
    courseId:z.uuid(),
    title:z.string().min(3, "Section title must be at least 3 characters long").max(100, "Section title must be at most 100 characters long"),
});

export type CreateSectionSchema = z.infer<typeof createSectionSchema>;


export const sectionWithInfiniteScroll = z.object({
    courseId: id,
}).extend(infiniteScroll.shape);

export type SectionWithInfiniteScroll = z.infer<typeof sectionWithInfiniteScroll>;