import { router, protectedProcedure } from "@/server/api/trpc";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { createCommentSchema, filterCommentsSchema, commentWithInfiniteScroll } from "@/lib/schema/comment";
import { PaginationSchema } from "@/lib/schema/page";
import { id } from "@/lib/schema/common";

export const commentRouter = router({
    createComment: protectedProcedure
        .input(createCommentSchema)
        .mutation(async ({ ctx, input }) => {
            const prisma = ctx.prisma;
            const { content, parentId, lessonId } = input;
            try {
                const role = ctx.session?.user.role;
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
                        message: "Cannot comment on lessons of unpublished courses",
                    });
                }
                if (role === 'admin') {
                    return await prisma.comment.create({
                        data: {
                            content,
                            parentId,
                            lessonId,
                            userId: ctx.session!.user.id,
                        },
                    });
                }
                else if (role === 'teacher') {
                    if (!isDeleted?.instructor.some(instr => instr.userId === ctx.session!.user.id && instr.status === 'APPROVED')) {
                        throw new TRPCError({
                            code: "FORBIDDEN",
                            message: "You are not authorized to like this comment",
                        });
                    }

                    return await prisma.comment.create({
                        data: {
                            content,
                            parentId,
                            lessonId,
                            userId: ctx.session!.user.id,
                        },
                    });
                } else {
                    const isEnrolled = await prisma.enrollment.findFirst({
                        where: {
                            userId: ctx.session!.user.id,
                            courseId: isDeleted.id,
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
                            message: "You can only comment on lessons of active or completed courses",
                        });
                    }
                    return await prisma.comment.create({
                        data: {
                            content,
                            parentId,
                            lessonId,
                            userId: ctx.session!.user.id,
                        },
                    });
                }
            } catch (error) {
                throw error;
            }
        }),
    filterComments: protectedProcedure
        .input(filterCommentsSchema)
        .query(async ({ ctx, input }) => {
            const prisma = ctx.prisma;
            const { lessonId, pageLimit, parentId } = input;
            const { page, limit } = pageLimit;
            try {
                const role = ctx.session?.user.role;
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
                        instructor: {
                            where: { status: 'APPROVED' }
                        }
                    },
                });
                if (!isDeleted) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Lesson not found",
                    });
                }
                const commentsCount = await prisma.comment.count({
                    where: {
                        lessonId,
                        parentId: parentId ?? null,
                    },
                });
                const skip = (page - 1) * limit;
                const comments = await prisma.comment.findMany({
                    where: {
                        lessonId,
                        parentId: parentId ?? null,

                    },
                    skip,
                    include: {
                        user: true,
                    },
                    take: limit,
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
                const commentWithLikeAndDisLikeStatus = await Promise.all(comments.map(async (comment) => {
                    const likeDislike = await prisma.commentReaction.findFirst({
                        where: {
                            commentId: comment.id,
                            userId: ctx.session!.user.id,
                        },
                    });
                    return !likeDislike ? { ...comment, liked: false, disliked: false } : likeDislike.type === 'LIKE' ? { ...comment, liked: true, disliked: false } : { ...comment, liked: false, disliked: true };
                }));
                const pagination: PaginationSchema = {
                    currentPage: page,
                    totalPages: Math.ceil(commentsCount / limit),
                    limit: limit,
                    totalItems: commentsCount,
                };
                if (role === 'admin') {
                    const commentsWithPermissions = commentWithLikeAndDisLikeStatus.map(comment => ({
                        ...comment,
                        permissions: { canCreate: true, canUpdate: true, canDelete: true }
                    }));
                    return { comments: commentsWithPermissions, pagination };
                }
                else if (role === 'teacher') {
                    const canCreate = isDeleted.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('CREATE'));
                    const canUpdate = isDeleted.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('UPDATE'));
                    const canDelete = isDeleted.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('DELETE'));
                    const commentsWithPermissions = commentWithLikeAndDisLikeStatus.map(comment => ({
                        ...comment,
                        permissions: { canCreate, canUpdate, canDelete }
                    }));
                    return { comments: commentsWithPermissions, pagination };

                } else {
                    const cannotDeleteComments = commentWithLikeAndDisLikeStatus.map(comment => ({
                        ...comment,
                        permissions: { canCreate: false, canUpdate: false, canDelete: comment.userId === ctx.session!.user.id },
                    }));
                    return { comments: cannotDeleteComments, pagination };
                }

            } catch (error) {
                throw error;
            }
        }),

    deleteComment: protectedProcedure.input(id).mutation(async ({ ctx, input }) => {
        const prisma = ctx.prisma;
        try {
            const role = ctx.session?.user.role;
            const isDeleted = await prisma.course.findFirst({
                where: {
                    sections: {
                        some: {
                            lessons: {
                                some: {
                                    comments: {
                                        some: {
                                            id: input,
                                        },
                                    },
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
                    message: "Cannot delete comments for lessons of unpublished courses",
                });
            }
            const comment = await prisma.comment.findUnique({
                where: { id: input },
            });
            if (!comment) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Comment not found",
                });
            }
            if (comment.userId === ctx.session!.user.id) {
                return await prisma.comment.delete({
                    where: { id: input },
                });
            }
            if (role === 'admin') {
                return await prisma.comment.delete({
                    where: { id: input },
                });
            }
            if (role === 'teacher' && isDeleted.instructor.some(instr => instr.userId === ctx.session!.user.id && instr.status === 'APPROVED' && instr.permissions.includes("DELETE"))) {
                return await prisma.comment.delete({
                    where: { id: input },
                });
            }
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You are not authorized to delete this comment",
            });


        } catch (error) {
            throw error;
        }
    }),
    commentWithInfiniteScroll: protectedProcedure
        .input(commentWithInfiniteScroll)
        .query(async ({ ctx, input }) => {
            const prisma = ctx.prisma;
            const { courseId, lessonId, parentId, cursor, limit } = input;
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
                const comments = await prisma.comment.findMany({
                    where: {
                        lessonId,
                        ...(parentId && { parentId: parentId }),

                    },
                    ...(cursor && {cursor: { id: cursor }}),
                    take: limitPlusOne,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        user: true,
                    },

                });
                const commentWithLikeAndDisLikeStatus = await Promise.all(comments.map(async (comment) => {
                    const likeDislike = await prisma.commentReaction.findFirst({
                        where: {
                            commentId: comment.id,
                            userId: ctx.session!.user.id,
                        },
                    });
                    return !likeDislike ? { ...comment, liked: false, disliked: false } : likeDislike.type === 'LIKE' ? { ...comment, liked: true, disliked: false } : { ...comment, liked: false, disliked: true };
                }));
                let canUpdate = false;
                let canDelete = false;
                let canCreate = false;
                let commentsWithPermissions = [];
                if (role === 'admin') {
                    commentsWithPermissions = commentWithLikeAndDisLikeStatus.map(comment => ({
                        ...comment,
                        permissions: { canCreate: true, canUpdate: true, canDelete: true }
                    }));
                }
                else if (role === 'teacher') {
                    const permissions = await prisma.courseInstructor.findFirst({
                        where: {
                            courseId: courseId,
                            userId: ctx.session!.user.id,
                            status: 'APPROVED'
                        }
                    });
                    canCreate = permissions ? permissions.permissions.includes('CREATE') : false;
                    canDelete = permissions ? permissions.permissions.includes('DELETE') : false;
                    canUpdate = permissions ? permissions.permissions.includes('UPDATE') : false;
                    commentsWithPermissions = commentWithLikeAndDisLikeStatus.map(comment => {
                        canUpdate = comment.userId === ctx.session!.user.id ? true : canUpdate;
                        canDelete = comment.userId === ctx.session!.user.id ? true : canDelete;
                        return {
                            ...comment,
                            permissions: { canCreate, canUpdate, canDelete }
                        }
                    });
                }
                else {
                    const isEnrolled = await prisma.enrollment.findFirst({
                        where: {
                            userId: ctx.session!.user.id,
                            courseId: courseId,
                            status: {
                                in: ['ACTIVE', 'COMPLETED']
                            }
                        },
                    });
                    canCreate = isEnrolled ? true : false;
                    commentsWithPermissions = commentWithLikeAndDisLikeStatus.map(comment => ({
                        ...comment,
                        permissions: { canCreate, canUpdate: comment.userId === ctx.session!.user.id, canDelete: comment.userId === ctx.session!.user.id },
                    }));
                }
                let nextCursor: typeof cursor | undefined = undefined;
                if (commentsWithPermissions.length > (limitPlusOne - 1)) {
                    const nextItem = commentsWithPermissions.pop(); // return the last item from the array
                    nextCursor = nextItem!.id;
                }
                return {
                    comments: commentsWithPermissions,
                    permissions: { canCreate, canUpdate, canDelete },
                    nextCursor
                };
            } catch (error) {
                throw error;
            }
        }),

});

export type CommentRouterOutputs = inferRouterOutputs<typeof commentRouter>;