import { router, teacherProcedure } from "@/server/api/trpc";
import { PaginationSchema } from "@/lib/schema/page";
import { filteredEnrollmentsSchemaWithPageLimit, studentsWithInfiniteScrollSchema, filteredEnrollmentsSchemaWithInfiniteScroll } from "@/lib/schema/enrollment";
import { inferRouterOutputs } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { startOfMonth, endOfMonth } from "date-fns";

export const enrollmentRouter = router({
    getEnrollmentsByCourseId: teacherProcedure.input(filteredEnrollmentsSchemaWithPageLimit).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { courseId, pageLimit, search, status } = input;
        const { page, limit } = pageLimit;
        try {
            const enrollmentCount = await prisma.enrollment.count({
                where: {
                    courseId: courseId,
                    course: {
                        instructor: {
                            some: {
                                userId: ctx.session!.user.id,
                                status: 'APPROVED'
                            }
                        },
                        isActive: true
                    },
                    ...(search ? {
                        user: {
                            OR: [
                                { name: { contains: search, mode: "insensitive" } },
                                { email: { contains: search, mode: "insensitive" } },
                                { username: { contains: search, mode: "insensitive" } },
                            ]
                        }
                    } : {}),
                    status: status === 'ALL' ? undefined : status
                }
            });
            if (enrollmentCount === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No enrollments found for this course",
                });
            }
            const skip = (page - 1) * limit;
            const enrollments = await prisma.enrollment.findMany({
                where: {
                    courseId: courseId,
                    course: {
                        instructor: {
                            some: {
                                userId: ctx.session!.user.id,
                                status: 'APPROVED'
                            }
                        },
                        isActive: true
                    },
                    ...(search && {
                        user: {
                            OR: [
                                { name: { contains: search, mode: "insensitive" } },
                                { email: { contains: search, mode: "insensitive" } },
                                { username: { contains: search, mode: "insensitive" } },
                            ]
                        }
                    }),
                    ...(status !== 'ALL' && { status: status }),
                },
                skip: skip,
                take: limit,
                include: {
                    user: true,
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            const pagination: PaginationSchema = {
                totalItems: enrollmentCount,
                totalPages: Math.ceil(enrollmentCount / limit),
                currentPage: page,
                limit: limit
            };
            return { enrollments, pagination };
        } catch (error) {
            throw error;
        }
    }),
    getMonthlyEnrollments: teacherProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const now = new Date();
            const startMonth = startOfMonth(now);
            const endMonth = endOfMonth(now);
            const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const [thisMonthEnrollments, lastMonthEnrollments] = await Promise.all([
                prisma.enrollment.count({
                    where: {
                        createdAt: {
                            gte: startMonth,
                            lte: endMonth,
                        },
                        course: {
                            instructor: {
                                some: { userId: ctx.session!.user.id, status: 'APPROVED' }
                            },
                            isActive: true
                        },
                    },
                }),
                prisma.enrollment.count({
                    where: {
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd,
                        },
                        course: {
                            instructor: {
                                some: { userId: ctx.session!.user.id, status: 'APPROVED' }
                            },
                            isActive: true
                        },
                    },
                }),
            ]);
            const percentageChange = lastMonthEnrollments > 0
                ? ((thisMonthEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100
                : (thisMonthEnrollments > 0 ? 100 : 0);
            return {
                thisMonthEnrollments,
                percentageChange: percentageChange,
            };
        } catch (error) {
            throw error;
        }
    }),

    getMonthlyUniqueStudents: teacherProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const now = new Date();
            const startMonth = startOfMonth(now);
            const endMonth = endOfMonth(now);
            const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const [thisMonthStudents, lastMonthStudents] = await Promise.all([
                prisma.enrollment.findMany({
                    where: {
                        createdAt: {
                            gte: startMonth,
                            lte: endMonth,
                        },
                        course: {
                            instructor: {
                                some: { userId: ctx.session!.user.id, status: 'APPROVED' }
                            },
                            isActive: true
                        },
                    },
                    distinct: ['userId'],
                }),
                prisma.enrollment.findMany({
                    where: {
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd,
                        },
                        course: {
                            instructor: {
                                some: { userId: ctx.session!.user.id, status: 'APPROVED' }
                            },
                            isActive: true
                        },
                    },
                    distinct: ['userId'],
                }),
            ]);
            const thisMonthStudentsCount = thisMonthStudents.length;
            const lastMonthStudentsCount = lastMonthStudents.length;
            const percentageChange = lastMonthStudentsCount > 0
                ? ((thisMonthStudentsCount - lastMonthStudentsCount) / lastMonthStudentsCount) * 100
                : (thisMonthStudentsCount > 0 ? 100 : 0);
            return {
                thisMonthStudentsCount,
                percentageChange: percentageChange,
            };
        } catch (error) {
            throw error;
        }
    }),

    uniqueStudentsInfiniteScroll: teacherProcedure.input(studentsWithInfiniteScrollSchema).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { cursor, limit, courseId, status, search } = input;
        try {
            const limitPlusOne = limit ? limit + 1 : 11;
            const enrollments = await prisma.enrollment.findMany({
                where: {
                    ...(courseId && { courseId: courseId }),
                    course: {
                        instructor: {
                            some: {
                                userId: ctx.session!.user.id,
                                status: 'APPROVED'
                            }
                        },
                        isActive: true
                    },
                    ...(search && {
                        user: {
                            OR: [
                                { name: { contains: search, mode: "insensitive" } },
                                { email: { contains: search, mode: "insensitive" } },
                                { username: { contains: search, mode: "insensitive" } },
                            ]
                        }
                    }),
                    ...(status !== 'ALL' && { status: status }),
                },
                distinct: ['userId'],
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    user: true,
                },
                take: limitPlusOne,
                ...(cursor && { cursor: { id: cursor } }),
            });
            let nextCursor: typeof cursor | undefined = undefined;
            if (enrollments.length > (limitPlusOne - 1)) {
                const nextItem = enrollments.pop();
                nextCursor = nextItem!.id;
            }
            return {
                enrollments,
                nextCursor,
            };
        } catch (error) {
            throw error;
        }
    }),

    enrollmentByCourseIdWithInfiniteScroll: teacherProcedure.input(filteredEnrollmentsSchemaWithInfiniteScroll).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { cursor, limit, courseId, status, search } = input;
        try {
            const limitPlusOne = limit ? limit + 1 : 11;
            const enrollments = await prisma.enrollment.findMany({
                where: {
                    courseId: courseId,
                    course: {
                        instructor: {
                            some: {
                                userId: ctx.session!.user.id,
                                status: 'APPROVED'
                            }
                        },
                        isActive: true
                    },
                    ...(search && {
                        user: {
                            OR: [
                                { name: { contains: search, mode: "insensitive" } },
                                { email: { contains: search, mode: "insensitive" } },
                                { username: { contains: search, mode: "insensitive" } },
                            ]
                        }
                    }),
                    ...(status !== 'ALL' && { status: status }),
                },
                ...(cursor && { cursor: { id: cursor } }),
                take: limitPlusOne,
                include: {
                    user: true,
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            let nextCursor: typeof cursor | undefined = undefined;
            if (enrollments.length > (limitPlusOne - 1)) {
                const nextItem = enrollments.pop();
                nextCursor = nextItem!.id;
            }
            return {
                enrollments,
                nextCursor,
            };
        } catch (error) {
            throw error;
        }
    }),

});

export type EnrollmentRouterOutput = inferRouterOutputs<typeof enrollmentRouter>;