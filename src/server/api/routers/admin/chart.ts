import { router, adminProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { dayEnum } from "@/lib/schema/day";
import { startOfDay, endOfDay, subDays, format, isBefore, addDays } from 'date-fns';


export const chartRouter = router({
    getRegistrationsOverTime: adminProcedure.input(dayEnum).query(async ({ ctx, input }) => {
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
                const [users,instructors,admins] = await Promise.all([
                    prisma.user.groupBy({
                        by: ['createdAt'],
                        where: {
                            role:'user',
                            ...dayFilter
                        },
                        _count: { id: true },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    }),
                    prisma.user.groupBy({
                        by: ['createdAt'],
                        where: {
                            role:'teacher',
                            ...dayFilter
                        },
                        _count: { id: true },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    }),
                    prisma.user.groupBy({
                        by: ['createdAt'],
                        where: {
                            role:'admin',
                            ...dayFilter
                        },
                        _count: { id: true },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    })
                ]);
                const usersMap = new Map<string, number>();
                users.forEach(item => {
                    const dateKey = format(item.createdAt, 'yyyy-MM-dd');
                    usersMap.set(dateKey, usersMap.get(dateKey)? usersMap.get(dateKey)! + item._count.id : item._count.id);
                });
                const instructorsMap = new Map<string, number>();
                instructors.forEach(item => {
                    const dateKey = format(item.createdAt, 'yyyy-MM-dd');
                    instructorsMap.set(dateKey, instructorsMap.get(dateKey)? instructorsMap.get(dateKey)! + item._count.id : item._count.id);
                });
                const adminsMap = new Map<string, number>();
                admins.forEach(item => {
                    const dateKey = format(item.createdAt, 'yyyy-MM-dd');
                    adminsMap.set(dateKey, adminsMap.get(dateKey)? adminsMap.get(dateKey)! + item._count.id : item._count.id);
                });
                const dates: string[] = [];
                if(startDay){
                    let cursor = startOfDay(startDay);
                    const last = startOfDay(endDay);
                    while(isBefore(cursor, addDays(last,1))){
                        dates.push(format(cursor, 'yyyy-MM-dd'));
                        cursor = addDays(cursor, 1);
                    }
                } else {
                    const set = new Set<string>([
                        ...Array.from(usersMap.keys()),
                        ...Array.from(instructorsMap.keys()),
                        ...Array.from(adminsMap.keys())
                    ]);
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
                    users: usersMap.get(date) ?? 0,
                    instructors: instructorsMap.get(date) ?? 0,
                    admins: adminsMap.get(date) ?? 0,
                }));
                return result;
        } catch (error) {
            throw error;
        }
    }),
});


export type ChartRouterOutputs = inferRouterOutputs<typeof chartRouter>;

