import { router, adminProcedure } from "@/server/api/trpc";
import { startOfMonth, endOfMonth } from "date-fns";

export const enrollmentRouter = router({
    getMonthlyEnrollments: adminProcedure.query(async ({ ctx }) => {
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
                            lte: endMonth
                        }
                    },
                }),
                prisma.enrollment.count({
                    where: {
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd
                        }
                    },
                })
            ]);
            const percentageChange = lastMonthEnrollments > 0
                ? ((thisMonthEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100
                : (thisMonthEnrollments > 0 ? 100 : 0);
            return {
                thisMonthEnrollments: thisMonthEnrollments,
                percentageChange: percentageChange,
            }
        } catch (error) {
            throw error;
        }
    }),
    getMonthlyUniqueStudents: adminProcedure.query(async ({ ctx }) => {
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
                            lte: endMonth
                        }
                    },
                    distinct: ['userId'],
                }),
                prisma.enrollment.findMany({
                    where: {
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd
                        }
                    },
                    distinct: ['userId'],
                })
            ]);
            const thisMonthStudentsCount = thisMonthStudents.length;
            const lastMonthStudentsCount = lastMonthStudents.length;
            const percentageChange = lastMonthStudentsCount > 0
                ? ((thisMonthStudentsCount - lastMonthStudentsCount) / lastMonthStudentsCount) * 100
                : (thisMonthStudentsCount > 0 ? 100 : 0);
            return {
                thisMonthStudentsCount: thisMonthStudentsCount,
                percentageChange: percentageChange,
            }
        } catch (error) {
            throw error;
        }
    }),
});