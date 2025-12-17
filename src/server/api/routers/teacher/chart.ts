import { router, teacherProcedure } from "@/server/api/trpc";
import { dayEnum } from "@/lib/schema/day";
import { inferRouterOutputs } from "@trpc/server";
import { startOfDay, endOfDay, subDays, format, isBefore, addDays } from 'date-fns';

export const chartRouter = router({
    getCourseEnrollmentsOverTime: teacherProcedure.input(dayEnum).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const now = new Date();
            const startDay = input === "1"
                ? startOfDay(now)
                : input !== "ALL"
                    ? startOfDay(subDays(now, Number(input) - 1))
                    : undefined;
            const endDay = endOfDay(now);
            const dayFilter = input !== "ALL"
                ? {
                    createdAt: {
                        gte: startDay,
                        lte: endDay
                    }
                }
                : undefined;

            const [enrollments, courses] = await Promise.all([
                prisma.enrollment.groupBy({
                    by: ['createdAt'],
                    where: {
                        course: {
                            instructor: {
                                some: {
                                    userId: ctx.session!.user.id,
                                    status: 'APPROVED'
                                }
                            }
                        },
                        ...dayFilter
                    },
                    _count: { id: true },
                    orderBy: {
                        createdAt: 'asc'
                    }
                }),
                prisma.course.groupBy({
                    by: ['createdAt'],
                    where: {
                        instructor: {
                            some: {
                                userId: ctx.session!.user.id,
                                status: 'APPROVED'
                            }
                        },
                        ...dayFilter
                    },
                    _count: { id: true },
                    orderBy: {
                        createdAt: 'asc'
                    }
                })
            ]);

            const enrollmentsMap = new Map<string, number>();
            const coursesMap = new Map<string, number>();

            enrollments.forEach(enrollment => {
                const dateKey = format(enrollment.createdAt, 'yyyy-MM-dd');
                enrollmentsMap.set(dateKey, enrollmentsMap.get(dateKey) ? enrollmentsMap.get(dateKey)! + enrollment._count.id : enrollment._count.id);
            });

            courses.forEach(course => {
                const dateKey = format(course.createdAt, 'yyyy-MM-dd');
                coursesMap.set(dateKey, coursesMap.get(dateKey) ? coursesMap.get(dateKey)! + course._count.id : course._count.id);
            });
            const dates: string[] = [];
            if (startDay) {
                let cursor = startOfDay(startDay);
                const last = startOfDay(endDay);
                while (isBefore(cursor, addDays(last, 1))) {
                    dates.push(format(cursor, 'yyyy-MM-dd'));
                    cursor = addDays(cursor, 1);
                }
            } else {
                // ALL: union of observed dates (no fixed window)
                const set = new Set<string>([
                    ...Array.from(enrollmentsMap.keys()),
                    ...Array.from(coursesMap.keys())
                ]);
                const startDay = Array.from(set).sort()[0];
                let cursor = startOfDay(startDay);
                const last = startOfDay(endDay);
                while (isBefore(cursor, addDays(last, 1))) {
                    dates.push(format(cursor, 'yyyy-MM-dd'));
                    cursor = addDays(cursor, 1);
                }
            }

            const result = dates.map(date => ({
                date,
                enrollments: enrollmentsMap.get(date) ?? 0,
                courses: coursesMap.get(date) ?? 0
            }));

            return result;


        }
        catch (error) {
            throw error;
        }
    }),
    getEarningOverTime: teacherProcedure.input(dayEnum).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const now = new Date();
            const startDay = input === "1"
                ? startOfDay(now)
                : input !== "ALL"
                    ? startOfDay(subDays(now, Number(input) - 1))
                    : undefined;
            const endDay = endOfDay(now);
            const dayFilter = input !== "ALL"
                ? {
                    createdAt: {
                        gte: startDay,
                        lte: endDay
                    }
                }
                : undefined;
            const earnings = await prisma.orderItemInstructorShare.groupBy({
                by: ['createdAt'],
                where: {
                    instructor: {
                        userId: ctx.session!.user.id,
                    },
                    orderItem: {
                        order: {
                            payment: {
                                some: {
                                    status: 'COMPLETED'
                                }
                            }
                        }
                    },
                    ...dayFilter
                },
                _sum: { shareAmount: true },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            const earningsMap = new Map<string, number>();
            earnings.forEach(earning => {
                const dateKey = format(earning.createdAt, 'yyyy-MM-dd');
                earningsMap.set(dateKey, earningsMap.get(dateKey) ? earningsMap.get(dateKey)! + (Number(earning._sum.shareAmount) ?? 0) : (Number(earning._sum.shareAmount) ?? 0));
            });
            const dates: string[] = [];
            if (startDay) {
                let cursor = startOfDay(startDay);
                const last = startOfDay(endDay);
                while (isBefore(cursor, addDays(last, 1))) {
                    dates.push(format(cursor, 'yyyy-MM-dd'));
                    cursor = addDays(cursor, 1);
                }
            } else {
                // ALL: union of observed dates (no fixed window)
                const set = new Set<string>(Array.from(earningsMap.keys()));
                const startDay = Array.from(set).sort()[0];
                let cursor = startOfDay(startDay);
                const last = startOfDay(endDay);
                while (isBefore(cursor, addDays(last, 1))) {
                    dates.push(format(cursor, 'yyyy-MM-dd'));
                    cursor = addDays(cursor, 1);
                }
            }
            const result = dates.map(date => ({
                date,
                earnings: earningsMap.get(date) ?? 0
            }));

            return result;


        }
        catch (error) {
            throw error;
        }
    }),
});


export type ChartRouterOutputs = inferRouterOutputs<typeof chartRouter>;

