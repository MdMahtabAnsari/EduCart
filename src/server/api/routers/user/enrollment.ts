import { router, userProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { startOfMonth, endOfMonth } from "date-fns";

export const enrollmentRouter = router({
    getMonthlyEnrollments: userProcedure.query(async ({ ctx }) => {
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
                        userId: ctx.session!.user.id,
                        createdAt: {
                            gte: startMonth,
                            lte: endMonth
                        }
                    },
                }),
                prisma.enrollment.count({
                    where: {
                        userId: ctx.session!.user.id,
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd
                        }
                    },
                }),
            ]);
            const percentageChange = lastMonthEnrollments > 0
                ? ((thisMonthEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100
                : (thisMonthEnrollments > 0 ? 100 : 0);
            return {
                thisMonthEnrollments: thisMonthEnrollments,
                percentageChange: percentageChange,
            };
        } catch (error) {
            throw error;

        }
    }),
});

export type EnrollmentRouterOutputs = inferRouterOutputs<typeof enrollmentRouter>;