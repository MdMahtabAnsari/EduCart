import { router, userProcedure } from "@/server/api/trpc";
import { dayEnum } from "@/lib/schema/day";
import { inferRouterOutputs } from "@trpc/server";
import { startOfDay, endOfDay, subDays, format, isBefore, addDays } from 'date-fns';

export const chartRouter = router({
    getCompletedLessonsOverTime: userProcedure.input(dayEnum).query(async ({ input, ctx }) => {
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

            const completedLessons = await prisma.lessonProgress.groupBy({
                by: ['createdAt'],
                where: {
                    lesson: {
                        section: {
                            course: {
                                enrollments: {
                                    some: {
                                        userId: ctx.session!.user.id,
                                        status:{
                                            in: ['COMPLETED','ACTIVE','EXPIRED']
                                        }
                                    }
                                }
                            }
                        },
                    },
                    completed: true,
                    ...dayFilter
                },
                _count: { id: true },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            console.log("completedLessons:", completedLessons);
            const completedLessonsMap = new Map<string, number>();
            completedLessons.forEach(item => {
                const dateKey = format(item.createdAt, 'yyyy-MM-dd');
                completedLessonsMap.set(dateKey, completedLessonsMap.get(dateKey)? completedLessonsMap.get(dateKey)! + item._count.id : item._count.id);
            });
            const dates: string[] = [];
            if(startDay){
                let cursor = startOfDay(startDay);
                const last = startOfDay(endDay);
                while(isBefore(cursor, addDays(last,1))){
                    dates.push(format(cursor, 'yyyy-MM-dd'));
                    cursor = addDays(cursor, 1);
                }
                console.log("dates:", dates);
            } else {
                const set = new Set<string>(Array.from(completedLessonsMap.keys()));
                const startDay = Array.from(set).sort()[0];
                let cursor = startOfDay(startDay);
                const last = startOfDay(endDay);
                while(isBefore(cursor, addDays(last,1))){
                    dates.push(format(cursor, 'yyyy-MM-dd'));
                    cursor = addDays(cursor, 1);
                }
            }
            const result = dates.map(date => ({
                date,
                completedLessons: completedLessonsMap.get(date) ?? 0
            }));
            return result;
        }
        catch (error) {
            throw error;
        }
    }),
});

export type ChartRouterOutputs = inferRouterOutputs<typeof chartRouter>;


