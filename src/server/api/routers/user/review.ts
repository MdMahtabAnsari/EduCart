import { router, userProcedure } from "@/server/api/trpc";
import { createReviewSchema } from "@/lib/schema/review";
import { id } from "@/lib/schema/common";
import { TRPCError } from "@trpc/server";

export const reviewRouter = router({
    submitCourseReview: userProcedure
        .input(
            createReviewSchema
        )
        .mutation(async ({ input, ctx }) => {
            const prisma = ctx.prisma;
            try {
                const isEnrolled = await prisma.enrollment.findFirst({
                    where: {
                        courseId: input.courseId,
                        userId: ctx.session!.user.id,
                        status: { in: ['ACTIVE', 'COMPLETED'] }
                    },
                    include: { course: true },
                });
                if (!isEnrolled) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "You must be enrolled in the course to submit a review",
                    });
                }
                if (!isEnrolled.course.isActive || !isEnrolled.course.published) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Cannot submit reviews for inactive or unpublished courses",
                    });
                }
                if (isEnrolled.status !== 'ACTIVE' && isEnrolled.status !== 'COMPLETED') {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "You can only submit reviews for active or completed courses",
                    });
                }
                const existingReview = await prisma.review.findFirst({
                    where: {
                        courseId: input.courseId,
                        userId: ctx.session!.user.id,
                    },
                });
                if (existingReview) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "You have already submitted a review for this course",
                    });
                }
                return await prisma.$transaction(async (prisma) => {
                    const review = await prisma.review.create({
                        data: {
                            courseId: input.courseId,
                            userId: ctx.session!.user.id,
                            rating: input.rating,
                            comment: input.comment,
                        },
                    });
                    const avgReviews = await prisma.review.aggregate({
                        where: { courseId: input.courseId },
                        _avg: { rating: true },
                    });
                    const averageRating = avgReviews._avg.rating || 0;
                    await prisma.course.update({
                        where: { id: input.courseId },
                        data: { ratings: averageRating },
                    });
                    return review;
                });
            } catch (error) {
                throw error;
            }
        }),
    deleteCourseReview: userProcedure
        .input(
            id
        )
        .mutation(async ({ input, ctx }) => {
            const prisma = ctx.prisma;
            try {
                const review = await prisma.review.findUnique({
                    where: {
                        id: input,
                    },
                    include: { course: true },
                });
                if (!review) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Review not found",
                    });
                }
                if (!review.course.isActive || !review.course.published) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Cannot delete reviews for inactive or unpublished courses",
                    });
                }
                if (review.userId !== ctx.session!.user.id) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "You can only delete your own reviews",
                    });
                }
                return await prisma.$transaction(async (prisma) => {
                    const deletedReview = await prisma.review.delete({
                        where: { id: input },
                    });
                    const avgReviews = await prisma.review.aggregate({
                        where: { courseId: review.courseId },
                        _avg: { rating: true },
                    });
                    const averageRating = avgReviews._avg.rating || 0;
                    await prisma.course.update({
                        where: { id: review.courseId },
                        data: { ratings: averageRating },
                    });
                    return deletedReview;
                });
            } catch (error) {
                throw error;
            }
        }),
});