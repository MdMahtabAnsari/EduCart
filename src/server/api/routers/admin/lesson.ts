import { router, adminProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";
import {
    createLessionSchemaBackEnd,
    editLessionSchemaBackEnd,
    lessonWithInfiniteScroll,
} from "@/lib/schema/lession";
import { id } from "@/lib/schema/common";
import { TRPCError } from "@trpc/server";

export const lessonRouter = router({
    createLesson: adminProcedure
        .input(createLessionSchemaBackEnd)
        .mutation(async ({ input, ctx }) => {
            const prisma = ctx.prisma;
            try {
                const isSectionExists = await prisma.section.findFirst({
                    where: {
                        id: input.sectionId,
                        course: {
                            id: input.courseId,
                            isActive: true
                        },
                    },
                });
                if (!isSectionExists) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Section not found",
                    });
                }
                const lesson = await prisma.$transaction(async (prisma) => {
                    const newMedia = await prisma.media.create({
                        data: {
                            url: input.media.url,
                            type: input.media.type,
                        },
                    });
                    const findLastOrder = await prisma.lesson.findFirst({
                        where: {
                            sectionId: input.sectionId,
                        },
                        orderBy: {
                            order: "desc",
                        },
                    });
                    return await prisma.lesson.create({
                        data: {
                            sectionId: input.sectionId,
                            title: input.title,
                            content: input.content,
                            order: findLastOrder ? findLastOrder.order + 1 : 1,
                            mediaId: newMedia.id,
                        },
                    });
                });
                return lesson;
            } catch (error) {
                throw error;
            }
        }),
    getLessonById: adminProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const lesson = await prisma.lesson.findFirst({
                where: {
                    id: input,
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
                    progress: {
                        where: { userId: ctx.session!.user.id }
                    },
                },
            });
            if (!lesson) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Lesson not found",
                });
            }
            return {lesson, permissions: { canCreate: true, canUpdate: true, canDelete: true }};
        } catch (error) {
            throw error;
        }
    }),
    editLesson: adminProcedure
        .input(editLessionSchemaBackEnd)
        .mutation(async ({ input, ctx }) => {
            const prisma = ctx.prisma;
            const { id, media, ...data } = input;
            try {
                const lesson = await prisma.$transaction(async (prisma) => {
                    const updatedLesson = await prisma.lesson.update({
                        where: {
                            id,
                            section: {
                                course: {
                                    isActive: true
                                },
                            },
                        },
                        data,
                    });
                    if (media) {
                        const newMedia = await prisma.media.create({
                            data: {
                                url: media.url,
                                type: media.type,
                            },
                        });
                        await prisma.lesson.update({
                            where: { id: updatedLesson.id },
                            data: { mediaId: newMedia.id },
                        });
                    }
                    return updatedLesson;
                });
                return lesson;
            } catch (error) {
                throw error;
            }
        }),
    deleteLesson: adminProcedure.input(id).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            return await prisma.lesson.delete({
                where: {
                    id: input,
                    section: {
                        course: {
                            isActive: true
                        },
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }),

    lessonWithInfiniteScroll: adminProcedure.input(lessonWithInfiniteScroll).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { limit, cursor, sectionId} = input;
        try {
            const limitPlusOne = limit ? limit + 1 : 11;
            const lessons = await prisma.lesson.findMany({
                where: {
                    sectionId: sectionId,
                },
                ...(cursor && {cursor: { id: cursor }}),
                take: limitPlusOne,
                orderBy: { order: 'asc' },
                include: {
                    progress:{
                        where: { userId: ctx.session!.user.id }
                    },
                },
            });
            let nextCursor: typeof cursor | undefined = undefined;
            if (lessons.length > (limitPlusOne-1)) {
                const nextItem = lessons.pop();
                nextCursor = nextItem!.id;
            }
            return { lessons, nextCursor, permissions: { canCreate: true, canUpdate: true, canDelete: true } };
        } catch (error) {
            throw error;
        }
    }),
});

export type LessonRouterOutputs = inferRouterOutputs<typeof lessonRouter>;
