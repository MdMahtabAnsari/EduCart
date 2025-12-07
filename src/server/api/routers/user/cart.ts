import { router, userProcedure } from "@/server/api/trpc";

import { id } from "@/lib/schema/common";
import { inferRouterOutputs } from "@trpc/server";
import { TRPCError } from "@trpc/server";

export const cartRouter = router({
    addToCart: userProcedure.input(id).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const isCourseExists = await prisma.course.findFirst({
                where: {
                    id: input,
                    isActive: true,
                    published: true,
                },
            });
            if (!isCourseExists) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Course not found",
                });
            }
            const isAlreadyEnrolled = await prisma.enrollment.findFirst({
                where: {
                    userId: ctx.session!.user.id,
                    courseId: input,
                    status: {
                        in: ['ACTIVE', 'COMPLETED']
                    }
                },
            });
            if (isAlreadyEnrolled) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You are already enrolled in this course",
                });
            }

            const isCartExists = await prisma.cart.findFirst({
                where: {
                    userId: ctx.session!.user.id,
                },
            });
            if (!isCartExists) {
                const cart = await prisma.cart.create({
                    data: {
                        userId: ctx.session!.user.id,
                    },
                });
                return await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        courseId: input,
                    },
                });
            }

            const cartSize = await prisma.cartItem.count({
                where: {
                    cartId: isCartExists.id,
                },
            });
            if (cartSize >= 10) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Cart can have a maximum of 10 items",
                });
            }

            return await prisma.cartItem.create({
                data: {
                    cartId: isCartExists.id,
                    courseId: input,
                },
            });
        } catch (error) {
            throw error;
        }
    }),
    removeFromCart: userProcedure.input(id).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const isCartExists = await prisma.cart.findFirst({
                where: {
                    userId: ctx.session!.user.id,
                },
            });
            if (!isCartExists) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cart not found",
                });
            }
            return await prisma.cartItem.delete({
                where: {
                    cartId_courseId: {
                        cartId: isCartExists.id,
                        courseId: input,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }),
    getCartItems: userProcedure.query(async ({ ctx }) => {
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
                                    media: true,
                                }
                            }
                        },
                    },
                },
            });
            if (!cart || cart.items.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cart is empty",
                });
            }
            const totalAmount = cart.items.reduce((sum, item) => {
                const course = item.course;
                if (course.isFree) {
                    return sum;
                }
                else if (Number(course.offerPrice) > 0) {
                    return sum + Number(course.offerPrice);
                }
                else { return sum + Number(course.price); }
            }, 0);
            return {
                items: cart.items,
                totalAmount: totalAmount,
            };
        } catch (error) {
            throw error;
        }
    }),
});


export type CartRouterOutputs = inferRouterOutputs<typeof cartRouter>;