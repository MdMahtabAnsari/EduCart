import { router, userProcedure } from "@/server/api/trpc";
import { orderSchema } from "@/lib/schema/order";
import { inferRouterOutputs } from "@trpc/server";
import { id } from "@/lib/schema/common";
import { TRPCError } from "@trpc/server";
import { filterUserOrdersSchema } from "@/lib/schema/order";
import { randomUUID } from "crypto";
import { PaginationSchema } from "@/lib/schema/page";
import { startOfMonth, endOfMonth } from "date-fns";

export const orderRouter = router({
    createOrder: userProcedure.input(orderSchema).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { courseIds } = input;
        try {
            try {
                const isEnrolled = await prisma.enrollment.count({
                    where: {
                        courseId: {
                            in: courseIds
                        },
                        userId: ctx.session!.user.id,
                        status: {
                            in: ['ACTIVE', 'COMPLETED']
                        }
                    },
                });
                if (isEnrolled > 0) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "User is already enrolled in one or more selected courses",
                    });
                }

                const courses = await prisma.course.findMany({
                    where: {
                        id: {
                            in: courseIds
                        },
                    },
                    include: {
                        instructor: {
                            where: {
                                status: 'APPROVED'
                            }
                        }
                    }
                });

                if (!courses || courses.length === 0) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Course not found",
                    });
                }
                if (!courses.every(course => course.isActive && course.published)) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "One or more courses are not available for purchase",
                    });
                }
                const totalAmount = courses.reduce((sum, curr) => {
                    if (curr.isFree) {
                        return sum;
                    }
                    else if (Number(curr.offerPrice) > 0) {
                        return sum + Number(curr.offerPrice);
                    }
                    else { return sum + Number(curr.price); }

                }, 0);
                if (totalAmount === 0) {
                    return await prisma.$transaction(async (prisma) => {
                        const order = await prisma.order.create({
                            data: {
                                userId: ctx.session!.user.id,
                                totalAmount: 0,
                            }
                        });
                        await Promise.all(
                            courses.map(async (course) => {
                                const orderItem = await prisma.orderItem.create({
                                    data: {
                                        orderId: order.id,
                                        courseId: course.id,
                                        amount: 0,
                                    }
                                });
                                await prisma.orderItemInstructorShare.createMany({
                                    data: course.instructor.map(instr => ({
                                        orderItemId: orderItem.id,
                                        instructorId: instr.id,
                                        shareAmount: 0,
                                    }))
                                });
                            })
                        );

                        const uuid = randomUUID();
                        await prisma.payment.create({
                            data: {
                                orderId: order.id,
                                userId: ctx.session!.user.id,
                                amount: 0,
                                status: "COMPLETED",
                                txnId: `free-course-${uuid}`,
                            }
                        });

                        await prisma.enrollment.createMany({
                            data: courses.map((course) => ({
                                courseId: course.id,
                                orderId: order.id,
                                userId: ctx.session!.user.id,
                                status: 'ACTIVE',
                            })),
                        });
                        return order;
                    });
                }
                return await prisma.$transaction(async (prisma) => {
                    const order = await prisma.order.create({
                        data: {
                            userId: ctx.session!.user.id,
                            totalAmount: totalAmount,
                        }
                    });
                    await Promise.all(
                        courses.map(async (course) => {
                            const amount = course.isFree ? 0 : (Number(course.offerPrice) > 0 ? Number(course.offerPrice) : Number(course.price));
                            const orderItem = await prisma.orderItem.create({
                                data: {
                                    orderId: order.id,
                                    courseId: course.id,
                                    amount: amount,

                                }
                            });
                            await prisma.orderItemInstructorShare.createMany({
                                data: course.instructor.map(instr => ({
                                    orderItemId: orderItem.id,
                                    instructorId: instr.id,
                                    shareAmount: amount * (Number(instr.share) / 100),
                                }))
                            });
                        })
                    );
                    return order;
                });
            }
            catch (error) {
                throw error;
            }
        } catch (error) {
            throw error;
        }
    }),

    getOrderById: userProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const order = await prisma.order.findFirst({
                where: {
                    id: input,
                    userId: ctx.session!.user.id,
                },
                include: {
                    orderItems: {
                        include: {
                            course: {
                                include: {
                                    media: true,
                                }
                            }
                        },
                    },
                    payment: {
                        include: {
                            providerPayment: true
                        }
                    }

                },
            });
            if (!order) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Order not found",
                });
            }
            const formattedOrder = {
                ...order,
                orderItems: order.orderItems.map(item => ({
                    ...item,
                    amount: Number(item.amount),
                    course: {
                        ...item.course,
                        price: Number(item.course.price),
                        offerPrice: Number(item.course.offerPrice),
                    },
                })),
                totalAmount: Number(order.totalAmount),
                payment: order.payment.map(payment => ({
                    ...payment,
                    amount: Number(payment.amount),
                })),
            }
            const makePayment = formattedOrder.totalAmount > 0 && !formattedOrder.payment.some(p => p.status === "COMPLETED");
            return { order: formattedOrder, makePayment };
        } catch (error) {
            throw error;
        }
    }),

    createOrderByCart: userProcedure.mutation(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const cart = await prisma.cart.findFirst({
                where: {
                    userId: ctx.session!.user.id,
                },
                include: {
                    items: {
                        include: {
                            course: {
                                include: {
                                    instructor: {
                                        where: {
                                            status: 'APPROVED'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            });
            if (!cart || cart.items.length === 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Cart is empty",
                });
            }
            const courses = cart.items.map(item => item.course);
            if (!courses.every(course => course.isActive && course.published)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "One or more courses are not available for purchase",
                });
            }
            const courseIds = cart.items.map(item => item.courseId);
            const isEnrolled = await prisma.enrollment.count({
                where: {
                    courseId: {
                        in: courseIds
                    },
                    userId: ctx.session!.user.id,
                    status: {
                        in: ['ACTIVE', 'COMPLETED']
                    }
                },
            });
            if (isEnrolled > 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User is already enrolled in one or more selected courses",
                });
            }

            const totalAmount = courses.reduce((sum, curr) => {
                if (curr.isFree) {
                    return sum;
                }
                else if (Number(curr.offerPrice) > 0) {
                    return sum + Number(curr.offerPrice);
                }
                else { return sum + Number(curr.price); }

            }, 0);

            if (totalAmount === 0) {
                return await prisma.$transaction(async (prisma) => {
                    const order = await prisma.order.create({
                        data: {
                            userId: ctx.session!.user.id,
                            totalAmount: 0,
                        }
                    });
                    await Promise.all(
                        courses.map(async (course) => {
                            await prisma.orderItem.create({
                                data: {
                                    orderId: order.id,
                                    courseId: course.id,
                                    amount: 0,
                                    instructorShares: {
                                        createMany: {
                                            data: course.instructor.map(instr => ({
                                                instructorId: instr.id,
                                                shareAmount: 0,
                                            }))
                                        }
                                    }
                                }
                            });
                        })
                    );
                    const uuid = randomUUID();
                    await prisma.payment.create({
                        data: {
                            orderId: order.id,
                            userId: ctx.session!.user.id,
                            amount: 0,
                            status: "COMPLETED",
                            txnId: `free-course-${uuid}`,
                        }
                    });
                    await prisma.enrollment.createMany({
                        data: courses.map((course) => ({
                            courseId: course.id,
                            orderId: order.id,
                            userId: ctx.session!.user.id,
                            status: 'ACTIVE',
                        })),
                    });

                    await prisma.cartItem.deleteMany({
                        where: {
                            cartId: cart.id,
                        },
                    });
                    return order;
                });
            }

            return await prisma.$transaction(async (prisma) => {
                const order = await prisma.order.create({
                    data: {
                        userId: ctx.session!.user.id,
                        totalAmount: totalAmount,
                    }
                });
                await Promise.all(
                    courses.map(async (course) => {
                        const amount = course.isFree ? 0 : (Number(course.offerPrice) > 0 ? Number(course.offerPrice) : Number(course.price));
                        await prisma.orderItem.create({
                            data: {
                                orderId: order.id,
                                courseId: course.id,
                                amount: amount,
                                instructorShares: {
                                    createMany: {
                                        data: course.instructor.map(instr => ({
                                            instructorId: instr.id,
                                            shareAmount: amount * (Number(instr.share) / 100),
                                        }))
                                    }
                                }
                            }
                        });
                    })
                );
                await prisma.cartItem.deleteMany({
                    where: {
                        cartId: cart.id,
                    },
                });
                return order;
            });
        } catch (error) {
            throw error;
        }

    }),
    filteredOrders: userProcedure.input(filterUserOrdersSchema).query(async ({ ctx, input }) => {
        const prisma = ctx.prisma;
        const { pageLimit, orderDate, amount, search } = input;
        const { page, limit } = pageLimit;
        try {
            const ordersCount = await prisma.order.count({
                where: {
                    userId: ctx.session!.user.id,
                    ...(search && {
                        id: search,
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
                    userId: ctx.session!.user.id,
                    ...(search && {
                        id: search,
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
    getMonthlySpending: userProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const now = new Date();
            const startMonth = startOfMonth(now);
            const endMonth = endOfMonth(now);
            const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const [thisMonthSpending, lastMonthSpending] = await Promise.all([
                prisma.order.aggregate({
                    _sum: {
                        totalAmount: true,
                    },
                    where: {
                        userId: ctx.session!.user.id,
                        createdAt: {
                            gte: startMonth,
                            lte: endMonth,
                        },
                        payment: {
                            some: {
                                status: 'COMPLETED'
                            }
                        }
                    },
                }),
                prisma.order.aggregate({
                    _sum: {
                        totalAmount: true,
                    },
                    where: {
                        userId: ctx.session!.user.id,
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd,
                        },
                        payment: {
                            some: {
                                status: 'COMPLETED'
                            }
                        }
                    },
                }),
            ]);
            const formattedThisMonthSpending = Number(thisMonthSpending._sum.totalAmount ?? 0);
            const formattedLastMonthSpending = Number(lastMonthSpending._sum.totalAmount ?? 0);
            const percentageChange = formattedLastMonthSpending > 0
                ? ((formattedThisMonthSpending - formattedLastMonthSpending) / formattedLastMonthSpending) * 100
                : (formattedThisMonthSpending > 0 ? 100 : 0);
            return {
                thisMonthSpending: formattedThisMonthSpending,
                percentageChange: percentageChange,
            };
        } catch (error) {
            throw error;
        }
    }),
    getMonthlyOrders: userProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const now = new Date();
            const startMonth = startOfMonth(now);
            const endMonth = endOfMonth(now);
            const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const [thisMonthOrderCount, lastMonthOrderCount] = await Promise.all([
                prisma.order.count({
                    where: {
                        userId: ctx.session!.user.id,
                        createdAt: {
                            gte: startMonth,
                            lte: endMonth,
                        },
                        payment: {
                            some: {
                                status: 'COMPLETED'
                            }
                        }
                    },
                }),
                prisma.order.count({
                    where: {
                        userId: ctx.session!.user.id,
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd,
                        },
                        payment: {
                            some: {
                                status: 'COMPLETED'
                            }
                        }
                    },
                }),
            ]);
            const percentageChange = lastMonthOrderCount > 0
                ? ((thisMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount) * 100
                : (thisMonthOrderCount > 0 ? 100 : 0);
            return {
                thisMonthOrderCount,
                percentageChange,
            };
        } catch (error) {
            throw error;
        }
    }),
    getMonthlyMothlyAverageSpending: userProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const now = new Date();
            const startMonth = startOfMonth(now);
            const endMonth = endOfMonth(now);
            const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const [thisMonthAverageSpending, lastMonthAverageSpending] = await Promise.all([
                prisma.order.aggregate({
                    _avg: {
                        totalAmount: true,
                    },
                    where: {
                        userId: ctx.session!.user.id,
                        createdAt: {
                            gte: startMonth,
                            lte: endMonth,
                        },
                        payment: {
                            some: {
                                status: 'COMPLETED'
                            }
                        }
                    },
                }),
                prisma.order.aggregate({
                    _avg: {
                        totalAmount: true,
                    },
                    where: {
                        userId: ctx.session!.user.id,
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd,
                        },
                        payment: {
                            some: {
                                status: 'COMPLETED'
                            }
                        }
                    },
                }),
            ]);
            const formattedThisMonthAverageSpending = Number(thisMonthAverageSpending._avg.totalAmount ?? 0);
            const formattedLastMonthAverageSpending = Number(lastMonthAverageSpending._avg.totalAmount ?? 0);
            const percentageChange = formattedLastMonthAverageSpending > 0
                ? ((formattedThisMonthAverageSpending - formattedLastMonthAverageSpending) / formattedLastMonthAverageSpending) * 100
                : (formattedThisMonthAverageSpending > 0 ? 100 : 0);
            return {
                thisMonthAverageSpending: formattedThisMonthAverageSpending,
                percentageChange,
            };
        } catch (error) {
            throw error;
        }
    }),
});

export type OrderRouterOutputs = inferRouterOutputs<typeof orderRouter>;