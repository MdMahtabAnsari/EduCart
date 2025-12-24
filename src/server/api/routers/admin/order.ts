import { filterAdminOrdersSchema } from "@/lib/schema/order";
import { PaginationSchema } from "@/lib/schema/page";
import { router, adminProcedure } from "@/server/api/trpc";
import { startOfMonth, endOfMonth } from "date-fns";
import { inferRouterOutputs } from "@trpc/server";

export const orderRouter = router({
    getMonthlyRevenue: adminProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const now = new Date();
            const startMonth = startOfMonth(now);
            const endMonth = endOfMonth(now);
            const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
                prisma.order.aggregate({
                    _sum: {
                        totalAmount: true,
                    },
                    where: {
                        payment: {
                            some: {
                                status: 'COMPLETED',
                                createdAt: {
                                    gte: startMonth,
                                    lte: endMonth
                                }
                            }
                        }
                    },
                }),
                prisma.order.aggregate({
                    _sum: {
                        totalAmount: true,
                    },
                    where: {
                        payment: {
                            some: {
                                status: 'COMPLETED',
                                createdAt: {
                                    gte: lastMonthStart,
                                    lte: lastMonthEnd
                                }
                            }
                        }
                    },
                })
            ]);
            const formattedThisMonthRevenue = Number(thisMonthRevenue._sum.totalAmount ?? 0);
            const formattedLastMonthRevenue = Number(lastMonthRevenue._sum.totalAmount ?? 0);
            const percentageChange = formattedLastMonthRevenue > 0
                ? ((formattedThisMonthRevenue - formattedLastMonthRevenue) / formattedLastMonthRevenue) * 100
                : (formattedThisMonthRevenue > 0 ? 100 : 0);
            return {
                thisMonthRevenue: formattedThisMonthRevenue,
                percentageChange: percentageChange,
            }
        } catch (error) {
            throw error;
        }
    }),
    getTotalRevenue: adminProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const totalRevenueData = await prisma.order.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    payment: {
                        some: {
                            status: 'COMPLETED',
                        }
                    }
                },
            });
            const totalRevenue = Number(totalRevenueData._sum.totalAmount ?? 0);
            return {
                totalRevenue: totalRevenue,
            };
        } catch (error) {
            throw error;
        }
    }),
    filteredOrders: adminProcedure.input(filterAdminOrdersSchema).query(async ({ ctx, input }) => {
        const prisma = ctx.prisma;
        const { pageLimit, orderDate, amount, search } = input;
        const { page, limit } = pageLimit;
        try {
            const ordersCount = await prisma.order.count({
                where: {
                    ...(search && {
                        OR: [
                            { id: search },
                            { user: { email: { contains: search, mode: 'insensitive' } } },
                            { user: { name: { contains: search, mode: 'insensitive' } } },

                        ]
                    }),
                },
            });
            const pagination: PaginationSchema = {
                currentPage: page,
                totalPages: Math.ceil(ordersCount / limit),
                totalItems: ordersCount,
                limit: limit,
            };
            if (ordersCount === 0) {
                return {
                    orders: [],
                    pagination,
                };
            }
            const skip = (page - 1) * limit;
            const orderByClause = (orderDate || amount) && {
                ...(orderDate && { createdAt: orderDate.toLowerCase() as 'asc' | 'desc' }),
                ...(amount && { totalAmount: amount.toLowerCase() as 'asc' | 'desc' }),
            };
            const orders = await prisma.order.findMany({
                where: {
                    ...(search && {
                        OR: [
                            { id: search },
                            { user: { email: { contains: search, mode: 'insensitive' } } },
                            { user: { name: { contains: search, mode: 'insensitive' } } },

                        ]
                    }),
                },
                orderBy: orderByClause,
                skip: skip,
                take: limit,
                include: {
                    payment: {
                        take: 1,
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    _count: {
                        select: {
                            orderItems: true,
                        }
                    },
                    user: true,
                }
            })
            return {
                orders,
                pagination,
            };
        } catch (error) {
            throw error;
        }
    }),
});

export type OrderRouterOutputs = inferRouterOutputs<typeof orderRouter>;
