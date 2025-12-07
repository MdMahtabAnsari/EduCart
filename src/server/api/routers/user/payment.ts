import { router, userProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { razorpayInstance } from "@/lib/payment/razorpay";
import { verifyRazorpayPaymentSchema } from "@/lib/schema/payment";
import { id } from '@/lib/schema/common';
import { createHmac } from "crypto";
import { TRPCError } from "@trpc/server";

export const paymentRouter = router({
    createRazorpayOrder: userProcedure.input(id).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const orderId = input;
        try {
            const order = await prisma.order.findUnique({
                where: { id: orderId, userId: ctx.session!.user.id },
            });
            if (!order) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Order not found",
                });
            }
            if (Number(order.totalAmount) <= 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid order amount for payment",
                });
            }
            const razorpayOrder = await razorpayInstance.orders.create({
                amount: Number(order.totalAmount) * 100,
                currency: "INR",
                receipt: order.id,
                notes: {
                    orderId: order.id,
                    userId: ctx.session!.user.id,
                    name: ctx.session!.user.name,
                    email: ctx.session!.user.email,
                },
            });

            await prisma.payment.create({
                data: {
                    orderId: order.id,
                    userId: ctx.session!.user.id,
                    amount: order.totalAmount,
                    txnId: razorpayOrder.id,
                    status: "PENDING",
                },

            });
            return razorpayOrder;
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            throw error;
        }
    }),
    verifyRazorpayPayment: userProcedure.input(verifyRazorpayPaymentSchema).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { paymentId, orderId, signature } = input;
        try {
            const secret = process.env.RAZORPAY_KEY_SECRET;
            if (!secret) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Razorpay key secret not configured",
                });
            }
            const payment = await prisma.payment.findFirst({
                where: {
                    txnId: orderId,
                    userId: ctx.session!.user.id,
                },
            });
            if (!payment) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Payment not found",
                });
            }
            const generatedSignature = createHmac("sha256", secret)
                .update(`${orderId}|${paymentId}`)
                .digest("hex");
            if (generatedSignature !== signature) {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: "FAILED" },
                });
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid signature",
                });
            }
            return prisma.$transaction(async (prisma) => {
                await prisma.providerPayment.create({
                    data: {
                        provider: "RAZORPAY",
                        providerPaymentId: paymentId,
                        paymentId: payment.id,
                    },
                });
                const updatedPayment = await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: "COMPLETED" },
                });
                const orderItems = await prisma.orderItem.findMany({
                    where: { orderId: payment.orderId },
                });
                await prisma.enrollment.createMany({
                    data: orderItems.map((item) => ({
                        courseId: item.courseId,
                        orderId: payment.orderId,
                        userId: ctx.session!.user.id,
                        status: 'ACTIVE',
                    })),
                });
                return updatedPayment;
            });
        } catch (error) {
            throw error;
        }
    }),
});



export type PaymentRouterOutputs = inferRouterOutputs<typeof paymentRouter>;