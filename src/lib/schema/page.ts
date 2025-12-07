import {z} from "zod/v4";

export const page = z.number().min(1, "Page number must be at least 1");
export const limit = z.number().min(1, "Limit must be at least 1").max(100, "Limit must be at most 100");

export const pageLimitSchema = z.object({
    page,
    limit,
});

export const paginationSchema = z.object({
    currentPage: page,
    limit: limit,
    totalPages: page,
    totalItems: z.number().int().nonnegative()
});

export type PaginationSchema = z.infer<typeof paginationSchema>;

export const directionEnum = z.enum(['forward', 'backward']);

export type DirectionEnum = z.infer<typeof directionEnum>;

export const infiniteScroll = z.object({
    cursor: z.string().optional(),
    limit: z.number().min(1).max(100).optional(),
    direction: directionEnum,
});
export type InfiniteScroll = z.infer<typeof infiniteScroll>;