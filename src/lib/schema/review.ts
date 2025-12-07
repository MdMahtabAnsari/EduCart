import { z } from "zod/v4";
import { id } from "@/lib/schema/common";
import { pageLimitSchema,infiniteScroll } from "@/lib/schema/page";

export const createReviewSchema = z.object({
    courseId: id,
    rating: z.number().min(0).max(5),
    comment: z.string().max(500,"Comment must be at most 500 characters long").optional(),
});

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;

export const filteredReviewsSchema = z.object({

    courseId: id,
    pageLimit: pageLimitSchema,
});

export type FilteredReviewsSchema = z.infer<typeof filteredReviewsSchema>;

export const reviewWithInfiniteScroll = z.object({
    courseId: id,
}).extend(infiniteScroll.shape);