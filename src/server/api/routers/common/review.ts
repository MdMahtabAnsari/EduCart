import { router, protectedProcedure } from "@/server/api/trpc";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { filteredReviewsSchema, reviewWithInfiniteScroll } from "@/lib/schema/review";
import { PaginationSchema } from "@/lib/schema/page";
import { Prisma } from "@/generated/prisma/client";

export const reviewRouter = router({
    filterdReviews: protectedProcedure
        .input(filteredReviewsSchema)
        .query(async ({ input, ctx }) => {
            const prisma = ctx.prisma;
            const { courseId, pageLimit } = input;
            const { page, limit } = pageLimit;
            try {
                const role = ctx.session!.user.role;
                const courseWhere: Prisma.CourseWhereInput | undefined =
                    role === "user"
                        ? { isActive: true, published: true }
                        : role === "teacher"
                            ? {
                                isActive: true,
                                instructor: {
                                    some: {
                                        userId: ctx.session!.user.id,
                                        status: "APPROVED",
                                    },
                                },
                            }
                            : undefined;
                const reviewCount = await prisma.review.count({
                    where: {
                        courseId,
                        course: courseWhere

                    },
                });
                const skip = (page - 1) * limit;
                const reviews = await prisma.review.findMany({
                    where: { courseId, course: courseWhere },
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                    include: {
                        user: true,
                    },
                });
                const pagination: PaginationSchema = {
                    totalItems: reviewCount,
                    totalPages: Math.ceil(reviewCount / limit),
                    currentPage: page,
                    limit: limit,
                };
                const reviewsWithPermission = reviews.map((review) => {
                    const canDelete = ctx.session!.user.id === review.userId || ctx.session!.user.role === 'admin';
                    const canUpdate = ctx.session!.user.id === review.userId;
                    const canCreate = ctx.session!.user.role === 'user'
                    return {
                        ...review,
                        permissions: { canCreate, canUpdate, canDelete }
                    };
                });
                return { reviews: reviewsWithPermission, pagination };
            } catch (error) {
                throw error;
            }
        }),
    reviewWithInfiniteScroll: protectedProcedure
        .input(reviewWithInfiniteScroll)
        .query(async ({ input, ctx }) => {
            const prisma = ctx.prisma;
            const { courseId, limit, cursor } = input;
            try {
                const role = ctx.session?.user.role;
                const isDeleted = await prisma.course.findFirst({
                    where: {
                        id: courseId,
                        isActive: false,
                    }
                });
                if (isDeleted) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Course not found",
                    });
                }
                const limitPlusOne = limit ? limit + 1 : 11;
                const reviews = await prisma.review.findMany({
                    where: { courseId },
                    ...(cursor && { cursor: { id: cursor } }),
                    take: limitPlusOne,
                    orderBy: { createdAt: "desc" },
                    include: {
                        user: true,
                    },
                });
                let canUpdate = false;
                let canDelete = false;
                let canCreate = false;
                let reviewWithPermissions = [];
                if (role === 'admin') {
                    canCreate = true;
                    canUpdate = true;
                    canDelete = true;
                    reviewWithPermissions = reviews.map((review) => ({
                        ...review,
                        permissions: { canCreate, canUpdate, canDelete }
                    }));
                }
                else if (role === 'teacher') {
                    canCreate = false;
                    canUpdate = false;
                    canDelete = false;
                    reviewWithPermissions = reviews.map((review) => ({
                        ...review,
                        permissions: { canCreate, canUpdate, canDelete }
                    }));
                }
                else {
                    const isEnrolled = await prisma.enrollment.findFirst({
                        where: {
                            courseId,
                            userId: ctx.session!.user.id,
                            status: {
                                in: ['ACTIVE', 'COMPLETED']
                            }
                        }
                    });
                    canCreate = isEnrolled ? true : false;
                    reviewWithPermissions = reviews.map((review) => {
                        canUpdate = ctx.session!.user.id === review.userId;
                        canDelete = ctx.session!.user.id === review.userId;
                        return {
                            ...review,
                            permissions: { canCreate, canUpdate, canDelete }
                        };
                    });
                }
                let nextCursor: typeof cursor | undefined = undefined;
                if (reviewWithPermissions.length > (limitPlusOne - 1)) {
                    const nextItem = reviewWithPermissions.pop();
                    nextCursor = nextItem!.id;
                }
                return { reviews: reviewWithPermissions, nextCursor, permissions: { canCreate, canUpdate, canDelete } };
            } catch (error) {
                throw error;
            }
        }),
});

export type ReviewRouterOutputs = inferRouterOutputs<typeof reviewRouter>;