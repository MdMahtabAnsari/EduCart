import { router, adminProcedure } from "@/server/api/trpc";
import { id } from "@/lib/schema/common";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { createSectionSchema, editSectionSchema, sectionWithInfiniteScroll } from "@/lib/schema/section";
export const sectionRouter = router({
    getSectionsByCourseId: adminProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const sections = await prisma.section.findMany({
                where: {
                    courseId: input,

                },
                orderBy: { order: 'asc' },
                include: {
                    lessons: {
                        orderBy: { order: 'asc' },
                        include: {
                            progress: true

                        }
                    },
                    course: {
                        include: {
                            instructor: {
                                where: { userId: ctx.session!.user.id }
                            }
                        }
                    }

                },
            });
            if (!sections || sections.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No sections found for this course",
                });
            }
            const canUpdate = sections.some(section => section.course.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('UPDATE')));
            const canDelete = sections.some(section => section.course.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('DELETE')));
            const canCreate = sections.some(section => section.course.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('CREATE')));
            return { sections, permissions: { canCreate, canUpdate, canDelete } };
        } catch (error) {
            throw error;
        }
    }),
    createSection: adminProcedure.input(createSectionSchema).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const isCourseExists = await prisma.course.findFirst({
                where: {
                    id: input.courseId,
                    isActive: true
                }
            });
            if (!isCourseExists) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course not found",
                });
            }
            const findLastOrder = await prisma.section.findFirst({
                where: {
                    courseId: input.courseId
                },
                orderBy: {
                    order: 'desc'
                }
            });
            const section = await prisma.section.create({
                data: {
                    courseId: input.courseId,
                    title: input.title,
                    order: findLastOrder ? findLastOrder.order + 1 : 1
                }
            });
            return section;
        } catch (error) {
            throw error;
        }
    }),
    getSectionById: adminProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const section = await prisma.section.findUnique({
                where: {
                    id: input,
                    course: {
                        isActive: true
                    }
                },
                include: {
                    lessons: { orderBy: { order: 'asc' }, include: { progress: true } },
                    course: {
                        include: {
                            instructor: {
                                where: { userId: ctx.session!.user.id }
                            }
                        }
                    }
                }
            });
            if (!section) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Section not found",
                });
            }
            return { section, permissions: { canCreate:true, canUpdate:true, canDelete:true } };
        } catch (error) {
            throw error;
        }
    }),
    deleteSection: adminProcedure.input(id).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            return await prisma.section.delete({
                where: {
                    id: input,
                    course: {
                        isActive: true
                    }
                }
            });
        } catch (error) {
            throw error;
        }
    }),
    sectionWithInfiniteScroll: adminProcedure.input(sectionWithInfiniteScroll).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { limit, cursor, courseId } = input;
        try {
            const limitPlusOne = limit ? limit + 1 : 11;
            const sections = await prisma.section.findMany({
                where: {
                    courseId: courseId,

                },
                ...(cursor && { cursor: { id: cursor } }),
                take: limitPlusOne,
                orderBy: { order: 'asc' },
            });


            let nextCursor: typeof cursor | undefined = undefined;
            if (sections.length > (limitPlusOne - 1)) {
                const nextItem = sections.pop(); // return the last item from the array
                nextCursor = nextItem!.id;
            }
            return { sections, nextCursor, permissions: { canCreate:true, canUpdate:true, canDelete:true } };
        } catch (error) {
            throw error;
        }
    }),
    editSection: adminProcedure.input(editSectionSchema).mutation(async ({ input, ctx }) => {
            const prisma = ctx.prisma;
            try {
                console.log("Editing section with input:", input);
                const section = await prisma.section.update({
                    where: {
                        id: input.id,
                        course: {
                            isActive: true
                        }
                    },
                    data: {
                        title: input.title
                    }
                });
                return section;
            } catch (error) {
                throw error;
            }
        }),
});


export type SectionRouterOutputs = inferRouterOutputs<typeof sectionRouter>;