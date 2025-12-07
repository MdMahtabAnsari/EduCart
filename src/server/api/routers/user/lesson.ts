import { router, userProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { id } from "@/lib/schema/common";
import { TRPCError } from "@trpc/server";
import { lessonWithInfiniteScroll } from "@/lib/schema/lession";

export const lessonRouter = router({
    getLessonById: userProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const lesson = await prisma.lesson.findFirst({
                where: {
                    id: input,
                    section: {
                        course: {
                            enrollments: {
                                some: {
                                    userId: ctx.session!.user.id,
                                    status: {
                                        in: ['ACTIVE', 'COMPLETED']
                                    }
                                }
                            }
                        }
                    }
                },
                include: {
                    media: true,
                    section: {
                        include: {
                            course: {
                                include: {
                                    instructor: {
                                        where: { userId: ctx.session!.user.id }
                                    }
                                }
                            }
                        }
                    },
                    progress: true,
                },
            });
            if (!lesson) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Lesson not found",
                });
            }
            return { lesson, permissions: { canCreate: false, canUpdate: false, canDelete: false } };
        } catch (error) {
            throw error;
        }
    }),

    makeLessonComplete: userProcedure.input(id).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const lesson = await prisma.lesson.findFirst({
                where: {
                    id: input,
                    section: {
                        course: {
                            enrollments: {
                                some: {
                                    userId: ctx.session!.user.id,
                                    status: {
                                        in: ['ACTIVE', 'COMPLETED']
                                    }
                                }
                            },
                            isActive: true,
                            published: true,
                        }
                    }
                },
            });
            if (!lesson) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Lesson not found",
                });
            }
            return await prisma.lessonProgress.create({
                data: {
                    lessonId: input,
                    userId: ctx.session!.user.id,
                    completed: true,
                },
            });
        }
        catch (error) {
            throw error;
        }
    }),
    lessonWithInfiniteScroll: userProcedure.input(lessonWithInfiniteScroll).query(async ({ input, ctx }) => {
            const prisma = ctx.prisma;
            const { limit, cursor, sectionId } = input;
            try {
                const limitPlusOne = limit ? limit + 1 : 11;
                const lessons = await prisma.lesson.findMany({
                    where: {
                        sectionId: sectionId,
                        section: {
                            course: {
                                isActive: true,
                                published: true
                            },
                        },
                    },
                    ...(cursor && {cursor: { id: cursor }}),
                    take: limitPlusOne,
                    orderBy: { order: 'asc' },
                    include: {
                        progress: true,
                    },
                });
                let nextCursor: typeof cursor | undefined = undefined;
                if (lessons.length > (limitPlusOne-1)) {
                    const nextItem = lessons.pop();
                    nextCursor = nextItem!.id;
                }
                return { lessons, nextCursor, permissions: { canCreate: false, canUpdate: false, canDelete: false } };
            } catch (error) {
                throw error;
            }
        }),

});

export type LessonRouterOutputs = inferRouterOutputs<typeof lessonRouter>;
