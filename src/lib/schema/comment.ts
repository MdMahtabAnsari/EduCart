import {z} from "zod/v4";
import {id} from "@/lib/schema/common";
import { pageLimitSchema,infiniteScroll } from "@/lib/schema/page";

export const createCommentSchema = z.object({
    content: z.string().min(3, "Comment must be at least 3 characters long").max(500, "Comment must be at most 500 characters long"),
    parentId: id.optional(),
    lessonId: id,
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;

export const filterCommentsSchema = z.object({
    lessonId: id,
    pageLimit: pageLimitSchema,
    parentId: id.optional(),
});

export const commentWithInfiniteScroll = z.object({
    courseId: id,
    lessonId: id,
    parentId: id.optional(),
}).extend(infiniteScroll.shape);