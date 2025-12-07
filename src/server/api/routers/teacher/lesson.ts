import { router, teacherProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";
import {
    createLessionSchemaBackEnd,
    editLessionSchemaBackEnd,
    lessonWithInfiniteScroll,
} from "@/lib/schema/lession";
import { id } from "@/lib/schema/common";
import { TRPCError } from "@trpc/server";

export const lessonRouter = router({
    createLesson: teacherProcedure
        .input(createLessionSchemaBackEnd)
        .mutation(async ({ input, ctx }) => {
            const prisma = ctx.prisma;
            try {
                const isSectionExists = await prisma.section.findFirst({
                    where: {
                        id: input.sectionId,
                        course: {
                            id: input.courseId,
                            instructor: {
                                some: {
                                    userId: ctx.session!.user.id,
                                    status: 'APPROVED',
                                    permissions: {
                                        has: "CREATE"
                                    }
                                },
                            },
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
    getLessonById: teacherProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const lesson = await prisma.lesson.findFirst({
                where: {
                    id: input,
                    section: {
                        course: {
                            instructor: {
                                some: {
                                    userId: ctx.session!.user.id,
                                    status: 'APPROVED',
                                },
                            },
                            isActive: true
                        },
                    },
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
            const canUpdate = lesson.section.course.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('UPDATE'));
            const canDelete = lesson.section.course.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('DELETE'));
            const canCreate = lesson.section.course.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('CREATE'));
            return {lesson, permissions: { canCreate, canUpdate, canDelete }};
        } catch (error) {
            throw error;
        }
    }),
    editLesson: teacherProcedure
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
                                    instructor: {
                                        some: {
                                            userId: ctx.session!.user.id,
                                            status: 'APPROVED',
                                            permissions: {
                                                has: "UPDATE"
                                            }

                                        },
                                    },
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
    deleteLesson: teacherProcedure.input(id).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            return await prisma.lesson.delete({
                where: {
                    id: input,
                    section: {
                        course: {
                            instructor: {
                                some: {
                                    userId: ctx.session!.user.id,
                                    status: 'APPROVED',
                                    permissions: {
                                        has: "DELETE"
                                    }
                                },
                            },
                            isActive: true
                        },
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }),

    lessonWithInfiniteScroll: teacherProcedure.input(lessonWithInfiniteScroll).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { limit, cursor, sectionId, courseId } = input;
        try {
            const limitPlusOne = limit ? limit + 1 : 11;
            const lessons = await prisma.lesson.findMany({
                where: {
                    sectionId: sectionId,
                    section: {
                        course: {
                            instructor: {
                                some: {
                                    userId: ctx.session!.user.id,
                                    status: 'APPROVED'
                                }
                            },
                            isActive: true
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
            const permissions = await prisma.courseInstructor.findFirst({
                where: {
                    courseId: courseId,
                    userId: ctx.session!.user.id,
                    status: 'APPROVED'
                }
            });
            const canUpdate = permissions ? permissions.permissions.includes('UPDATE') : false;
            const canDelete = permissions ? permissions.permissions.includes('DELETE') : false;
            const canCreate = permissions ? permissions.permissions.includes('CREATE') : false;
            let nextCursor: typeof cursor | undefined = undefined;
            if (lessons.length > (limitPlusOne-1)) {
                const nextItem = lessons.pop();
                nextCursor = nextItem!.id;
            }
            return { lessons, nextCursor, permissions: { canCreate, canUpdate, canDelete } };
        } catch (error) {
            throw error;
        }
    }),
});

export type LessonRouterOutputs = inferRouterOutputs<typeof lessonRouter>;
