'use client';
import { Product } from "@/components/payment/product";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

import { OrderRouterOutputs } from "@/server/api/routers/user/order";
import { SiRazorpay } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { VerifyRazorpayPaymentSchema } from "@/lib/schema/payment";
import { RazorpayResponse } from "@/providers/payment-provider";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { PaymentList } from "@/components/payment/payment-list";



interface OrderListProps {
    order: OrderRouterOutputs["getOrderById"];
}

export function OrderList({ order }: OrderListProps) {
    const { order: orderData, makePayment } = order;
    const router = useRouter();
    const createRazorpayOrder = api.user.payment.createRazorpayOrder.useMutation();
    const verifyRazorpayPayment = api.user.payment.verifyRazorpayPayment.useMutation();

    const onRazorpayClick = () => {
        toast.promise(
            createRazorpayOrder.mutateAsync(orderData.id, {
                onSuccess: (razorpayOrder) => {
                    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
                    if (!key) {
                        toast.error("Razorpay key not configured");
                        return;
                    }
                    if (!window.Razorpay) {
                        toast.error("Payment service not loaded. Please refresh the page.");
                        return;
                    }

                    const paymentObj = new window.Razorpay({
                        key: key,
                        order_id: razorpayOrder.id,
                        ...razorpayOrder,
                        handler: async (response: RazorpayResponse) => {
                            verifyRazorpayPaymentHandler({
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                                signature: response.razorpay_signature,
                            });
                        },
                    });
                    paymentObj.open();
                },
            }),
            {
                loading: "Creating payment order...",
                success: "Payment order created!",
                error: (err) => `Error: ${err.message}`,
            }
        );
    }

    const verifyRazorpayPaymentHandler = (paymentDetails: VerifyRazorpayPaymentSchema) => {
        toast.promise(
            verifyRazorpayPayment.mutateAsync(paymentDetails, {
                onSuccess: () => {
                    router.push("/user/courses/enrollments");
                },
            }),
            {
                loading: "Verifying payment...",
                success: "Payment verified successfully!",
                error: (err) => `Error: ${err.message}`,
            }
        );
    }



    return (
        <Card className="w-full h-fit bg-transparent shadow-none border-none">
            <CardHeader>
                <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {orderData.orderItems.map((item) => (
                    <Product key={item.id} orderItem={item} />
                ))}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="flex justify-between items-center w-full">
                    <div className="text-lg font-semibold">
                        Total: ₹{orderData.totalAmount.toFixed(2)}
                    </div>
                    {makePayment && (
                        <Button size="lg" className="cursor-pointer" onClick={onRazorpayClick}>
                            <SiRazorpay /> Pay with Razorpay
                        </Button>
                    )}
                </div>
                <Separator />
                {
                    orderData.payment.length > 0 && (
                        <PaymentList payments={orderData.payment} />
                    )
                }


            </CardFooter>
        </Card>
    );
}