import {z} from "zod/v4";


export const sectionSchema = z.object({
    courseId:z.uuid(),
    title:z.string().min(3, "Section title must be at least 3 characters long").max(100, "Section title must be at most 100 characters long"),
});

export type SectionSchema = z.infer<typeof sectionSchema>;