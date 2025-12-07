import { router, teacherProcedure } from "@/server/api/trpc";
import { startOfMonth, endOfMonth } from "date-fns";
import { PaginationSchema } from "@/lib/schema/page";
import {inferRouterOutputs } from "@trpc/server";
import { filterTeacherOrdersSchema } from "@/lib/schema/order";

export const orderRouter = router({
    getMonthlyRevenue: teacherProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const now = new Date();
            const startMonth = startOfMonth(now);
            const endMonth = endOfMonth(now);
            const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));

            const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
                prisma.orderItemInstructorShare.aggregate({
                    _sum: {
                        shareAmount: true,
                    },
                    where: {
                        orderItem: {
                            order: {
                                payment: {
                                    some: {
                                        status: 'COMPLETED',
                                        createdAt: {
                                            gte: startMonth,
                                            lte: endMonth
                                        }
                                    }
                                }
                            }
                        }
                    },
                }),
                prisma.orderItemInstructorShare.aggregate({
                    _sum: {
                        shareAmount: true,
                    },
                    where: {
                        orderItem: {
                            order: {
                                payment: {
                                    some: {
                                        status: 'COMPLETED',
                                        createdAt: {
                                            gte: lastMonthStart,
                                            lte: lastMonthEnd
                                        }
                                    }
                                }
                            }
                        }
                    },
                }),
            ]);

            const formattedThisMonthRevenue = Number(thisMonthRevenue._sum.shareAmount ?? 0);
            const formattedLastMonthRevenue = Number(lastMonthRevenue._sum.shareAmount ?? 0);

            const percentageChange = formattedLastMonthRevenue > 0
                ? ((formattedThisMonthRevenue - formattedLastMonthRevenue) / formattedLastMonthRevenue) * 100
                : (formattedThisMonthRevenue > 0 ? 100 : 0);
            return {
                thisMonthRevenue: formattedThisMonthRevenue,
                percentageChange: percentageChange,
            };
        } catch (error) {
            throw error;
        }
    }),
    filteredOrders: teacherProcedure.input(filterTeacherOrdersSchema).query(async ({ ctx, input }) => {
        const prisma = ctx.prisma;
        const { pageLimit, shareAmount, itemAmount, orderDate, search } = input;
        const { page, limit } = pageLimit;
        try {
            const ordersCount = await prisma.orderItemInstructorShare.count({
                where: {
                    instructor: {
                        userId: ctx.session!.user.id
                    },
                    ...(search &&
                    {
                        orderItem: {
                            order: {
                                user: {
                                    email: { contains: search, mode: 'insensitive' }
                                }
                            }
                        }
                    }

                    )
                }
            });
            const skip = (page - 1) * limit;
            const orderByClause = (shareAmount || itemAmount || orderDate) && {
                ...(shareAmount && { shareAmount: shareAmount.toLowerCase() as 'asc' | 'desc' }),
                ...(itemAmount && { orderItem: { amount: itemAmount.toLowerCase() as 'asc' | 'desc' } }),
                ...(orderDate && { createdAt: orderDate.toLowerCase() as 'asc' | 'desc' }),
            };
            const orders = await prisma.orderItemInstructorShare.findMany({
                where: {
                    instructor: {
                        userId: ctx.session!.user.id
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
                    ...(search &&
                    {
                        orderItem: {
                            order: {
                                user: {
                                    email: { contains: search, mode: 'insensitive' }
                                }
                            }
                        }
                    }

                    )
                },
                skip,
                take: limit,
                ...(orderByClause && { orderBy: orderByClause }),
                include: {
                    orderItem: {
                        include: {
                            order: {
                                include: {
                                    user: true,
                                }
                            }
                        },
                    }
                }
            });
            const pagination: PaginationSchema = {
                totalItems: ordersCount,
                totalPages: Math.ceil(ordersCount / limit),
                currentPage: page,
                limit: limit,
            };
            return {
                orders,
                pagination,
            };
        } catch (error) {
            throw error;
        }
    }),
});

export type OrderRouterOutput = inferRouterOutputs<typeof orderRouter>;