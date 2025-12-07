import { router, userProcedure } from "@/server/api/trpc";
import { id } from "@/lib/schema/common";
import { inferRouterOutputs } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { sectionWithInfiniteScroll } from "@/lib/schema/section";
export const sectionRouter = router({
    getSectionsByCourseId: userProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const sections = await prisma.section.findMany({
                where: {
                    courseId: input,
                    course: {
                        isActive: true,
                        published: true
                    }

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
            return { sections, permissions: { canCreate: false, canUpdate: false, canDelete: false } };
        } catch (error) {
            throw error;
        }
    }),
    getSectionById: userProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const section = await prisma.section.findUnique({
                where: {
                    id: input,
                    course: {
                        isActive: true,
                        published: true
                    }
                },
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
            if (!section) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Section not found",
                });
            }
            return { section, permissions: { canCreate: false, canUpdate: false, canDelete: false } };
        } catch (error) {
            throw error;
        }
    }),
    sectionWithInfiniteScroll: userProcedure.input(sectionWithInfiniteScroll).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { limit, cursor, courseId } = input;
        try {
            const limitPlusOne = limit ? limit + 1 : 11;
            const sections = await prisma.section.findMany({
                where: {
                    courseId: courseId,
                    course: {
                        published: true,
                        isActive: true
                    },

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
            return { sections, nextCursor, permissions: { canCreate:false, canUpdate:false, canDelete:false } };
        } catch (error) {
            throw error;
        }
    }),
});


export type SectionRouterOutputs = inferRouterOutputs<typeof sectionRouter>;