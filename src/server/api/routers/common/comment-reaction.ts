import { router, protectedProcedure } from "@/server/api/trpc";
import { commentReactionSchema } from "@/lib/schema/comment-reaction";
import { TRPCError } from "@trpc/server";


export const commentReactionRouter = router({
    likeComment: protectedProcedure
        .input(commentReactionSchema)
        .mutation(async ({ ctx, input }) => {
            const prisma = ctx.prisma;
            const { commentId, lessonId } = input;
            try {
                const role = ctx.session!.user.role;
                const isDeleted = await prisma.course.findFirst({
                    where: {
                        sections: {
                            some: {
                                lessons: {
                                    some: {
                                        id: lessonId,
                                    },
                                },
                            },
                        },
                        isActive: true

                    },
                    include: {
                        instructor: true,
                    },
                });
                if (!isDeleted) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Lesson not found",
                    });
                }
                if (!isDeleted.published) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Cannot react to comments for lessons of unpublished courses",
                    });
                }
                const existingReaction = await prisma.commentReaction.findFirst({
                    where: {
                        commentId,
                        userId: ctx.session!.user.id,
                    },
                });
                if (role === 'admin') {
                    if (!existingReaction) {
                        return await prisma.$transaction(async (prisma) => {
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'LIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { likes: { increment: 1 } },
                            });
                            return result;
                        });
                    }
                    else if (existingReaction.type === 'DISLIKE') {
                        return await prisma.$transaction(async (prisma) => {
                            await prisma.commentReaction.delete({
                                where: { id: existingReaction.id },
                            });
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'LIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { likes: { increment: 1 }, dislikes: { decrement: 1 } },
                            });
                            return result;
                        });
                    }
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "You have already liked this comment",
                    });
                } else if (role === 'teacher') {
                    if (!isDeleted.instructor.some(instr => instr.userId === ctx.session!.user.id && instr.status === 'APPROVED')) {
                        throw new TRPCError({
                            code: "FORBIDDEN",
                            message: "You are not authorized to like this comment",
                        });
                    }
                    if (!existingReaction) {
                        return await prisma.$transaction(async (prisma) => {
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'LIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { likes: { increment: 1 } },
                            });
                            return result;
                        });
                    }
                    else if (existingReaction.type === 'DISLIKE') {
                        return await prisma.$transaction(async (prisma) => {
                            await prisma.commentReaction.delete({
                                where: { id: existingReaction.id },
                            });
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'LIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { likes: { increment: 1 }, dislikes: { decrement: 1 } },
                            });
                            return result;
                        });
                    }
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "You have already liked this comment",
                    });
                } else {
                    const isEnrolled = await prisma.enrollment.findFirst({
                        where: {
                            userId: ctx.session!.user.id,
                            courseId: isDeleted.id,
                            status: "ACTIVE"
                        },
                    });
                    if (!isEnrolled) {
                        throw new TRPCError({
                            code: "FORBIDDEN",
                            message: "You are not enrolled in this course",
                        });
                    }
                    if (isEnrolled.status !== 'ACTIVE' && isEnrolled.status !== 'COMPLETED') {
                        throw new TRPCError({
                            code: "FORBIDDEN",
                            message: "You can only react to comments for lessons of active or completed courses",
                        });
                    }
                    if (!existingReaction) {
                        return await prisma.$transaction(async (prisma) => {
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'LIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { likes: { increment: 1 } },
                            });
                            return result;
                        });
                    }
                    else if (existingReaction.type === 'DISLIKE') {
                        return await prisma.$transaction(async (prisma) => {
                            await prisma.commentReaction.delete({
                                where: { id: existingReaction.id },
                            });
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'LIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { likes: { increment: 1 }, dislikes: { decrement: 1 } },
                            });
                            return result;
                        });
                    }
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "You have already liked this comment",
                    });
                }
            } catch (error) {
                throw error;
            }
        }),

    dislikeComment: protectedProcedure
        .input(commentReactionSchema)
        .mutation(async ({ ctx, input }) => {
            const prisma = ctx.prisma;
            const { commentId, lessonId } = input;
            try {
                const role = ctx.session!.user.role;
                const isDeleted = await prisma.course.findFirst({
                    where: {
                        sections: {
                            some: {
                                lessons: {
                                    some: {
                                        id: lessonId,
                                    },
                                },
                            },
                        },
                        isActive: true
                    },
                    include: {
                        instructor: true,
                    },
                });
                if (!isDeleted) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Lesson not found",
                    });
                }
                if (!isDeleted.published) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Cannot react to comments for lessons of unpublished courses",
                    });
                }
                const existingReaction = await prisma.commentReaction.findFirst({
                    where: {
                        commentId,
                        userId: ctx.session!.user.id,
                    },
                });
                if (role === 'admin') {

                    if (!existingReaction) {
                        return await prisma.$transaction(async (prisma) => {
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'DISLIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { dislikes: { increment: 1 } },
                            });
                            return result;
                        });
                    }
                    else if (existingReaction.type === 'LIKE') {
                        return await prisma.$transaction(async (prisma) => {
                            await prisma.commentReaction.delete({
                                where: { id: existingReaction.id },
                            });
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'DISLIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { dislikes: { increment: 1 }, likes: { decrement: 1 } },
                            });
                            return result;
                        });
                    }
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "You have already disliked this comment",
                    });
                } else if (role === 'teacher') {
                    if (!isDeleted.instructor.some(instr => instr.userId === ctx.session!.user.id && instr.status === 'APPROVED')) {
                        throw new TRPCError({
                            code: "FORBIDDEN",
                            message: "You are not authorized to dislike this comment",
                        });
                    }
                    if (!existingReaction) {
                        return await prisma.$transaction(async (prisma) => {
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'DISLIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { dislikes: { increment: 1 } },
                            });
                            return result;
                        });
                    } else if (existingReaction.type === 'LIKE') {
                        return await prisma.$transaction(async (prisma) => {
                            await prisma.commentReaction.delete({
                                where: { id: existingReaction.id },
                            });
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'DISLIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { dislikes: { increment: 1 }, likes: { decrement: 1 } },
                            });
                            return result;
                        });
                    }
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "You have already disliked this comment",
                    });
                } else {
                    const isEnrolled = await prisma.enrollment.findFirst({
                        where: {
                            userId: ctx.session!.user.id,
                            courseId: isDeleted.id,
                            status: "ACTIVE"
                        },
                    });
                    if (!isEnrolled) {
                        throw new TRPCError({
                            code: "FORBIDDEN",
                            message: "You are not enrolled in this course",
                        });
                    }
                    if (isEnrolled.status !== 'ACTIVE' && isEnrolled.status !== 'COMPLETED') {
                        throw new TRPCError({
                            code: "FORBIDDEN",
                            message: "You can only react to comments for lessons of active or completed courses",
                        });
                    }
                    if (!existingReaction) {
                        return await prisma.$transaction(async (prisma) => {
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'DISLIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { dislikes: { increment: 1 } },
                            });
                            return result;
                        });
                    } else if (existingReaction.type === 'LIKE') {
                        return await prisma.$transaction(async (prisma) => {
                            await prisma.commentReaction.delete({
                                where: { id: existingReaction.id },
                            });
                            const result = await prisma.commentReaction.create({
                                data: {
                                    commentId,
                                    userId: ctx.session!.user.id,
                                    type: 'DISLIKE',
                                },
                            });
                            await prisma.comment.update({
                                where: { id: commentId },
                                data: { dislikes: { increment: 1 }, likes: { decrement: 1 } },
                            });
                            return result;
                        });
                    }
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "You have already disliked this comment",
                    });
                }
            }
            catch (error) {
                throw error;
            }
        }),
    unLikeComment: protectedProcedure
        .input(commentReactionSchema)
        .mutation(async ({ ctx, input }) => {
            const prisma = ctx.prisma;
            const { commentId, lessonId } = input;
            try {
                const isDeleted = await prisma.course.findFirst({
                    where: {
                        sections: {
                            some: {
                                lessons: {
                                    some: {
                                        id: lessonId,
                                    },
                                },
                            },
                        },
                        isActive: true

                    },
                });
                if (!isDeleted) {
                    throw new Error("Lesson not found");
                }
                if (!isDeleted.published) {
                    throw new Error("Cannot react to comments for lessons of unpublished courses");
                }
                const existingReaction = await prisma.commentReaction.findFirst({
                    where: {
                        commentId,
                        userId: ctx.session!.user.id,
                        type: 'LIKE',
                    },
                });
                if (!existingReaction) {
                    throw new Error("You have not liked this comment");
                }
                return await prisma.$transaction(async (prisma) => {
                    const result = await prisma.commentReaction.delete({
                        where: { id: existingReaction.id },
                    });
                    await prisma.comment.update({
                        where: { id: commentId },
                        data: { likes: { decrement: 1 } },
                    });
                    return result;
                });
            } catch (error) {
                throw error;
            }
        }),

    unDislikeComment: protectedProcedure.input(commentReactionSchema).mutation(async ({ ctx, input }) => {
        const prisma = ctx.prisma;
        const { commentId, lessonId } = input;
        try {
            const isDeleted = await prisma.course.findFirst({
                where: {
                    sections: {
                        some: {
                            lessons: {
                                some: {
                                    id: lessonId,
                                },
                            },
                        },
                    },
                    isActive: true

                },
            });
            if (!isDeleted) {
                throw new Error("Lesson not found");
            }
            if (!isDeleted.published) {
                throw new Error("Cannot react to comments for lessons of unpublished courses");
            }
            const existingReaction = await prisma.commentReaction.findFirst({
                where: {
                    commentId,
                    userId: ctx.session!.user.id,
                    type: 'DISLIKE',
                },
            });
            if (!existingReaction) {
                throw new Error("You have not disliked this comment");
            }
            return await prisma.$transaction(async (prisma) => {
                const result = await prisma.commentReaction.delete({
                    where: { id: existingReaction.id },
                });
                await prisma.comment.update({
                    where: { id: commentId },
                    data: { dislikes: { decrement: 1 } },
                });
                return result;
            }
            );
        } catch (error) {
            throw error;
        }
    }),
});