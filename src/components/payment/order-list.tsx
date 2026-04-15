'use client';

import { Product } from "@/components/payment/product";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { OrderRouterOutputs } from "@/server/api/routers/user/order";
import { SiRazorpay } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { type VerifyRazorpayPaymentSchema } from "@/lib/schema/payment";
import { type RazorpayResponse } from "@/providers/payment-provider";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { PaymentList } from "@/components/payment/payment-list";
import { ShoppingBag, ReceiptIndianRupee, ShieldCheck } from "lucide-react";

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
                success: "Secure checkout initialized",
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
        <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
            {/* Left Side: Order Items */}
            <div className="flex-2 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold tracking-tight">Order Items</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    {orderData.orderItems.map((item) => (
                        <Product key={item.id} orderItem={item} />
                    ))}
                </div>

                {orderData.payment.length > 0 && (
                    <div className="mt-10 space-y-4">
                        {/* <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold tracking-tight">Payment History</h2>
                        </div> */}
                        <PaymentList payments={orderData.payment} />
                    </div>
                )}
            </div>

            {/* Right Side: Price Summary & Checkout */}
            <div className="flex-1">
                <Card className="sticky top-6 border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <ReceiptIndianRupee className="w-5 h-5 text-primary" />
                            Summary
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Subtotal</span>
                                <span>₹{orderData.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Tax (included)</span>
                                <span>₹0.00</span>
                            </div>
                        </div>
                        
                        <Separator className="bg-border/60" />
                        
                        <div className="flex justify-between items-center py-2">
                            <span className="text-base font-bold">Total Amount</span>
                            <span className="text-2xl font-black text-primary tabular-nums">
                                ₹{orderData.totalAmount.toFixed(2)}
                            </span>
                        </div>

                        <div className="bg-emerald-500/5 rounded-lg p-3 flex items-start gap-3 border border-emerald-500/10">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5" />
                            <p className="text-[11px] text-emerald-700 leading-tight">
                                Secure encrypted payment powered by Razorpay. Your data is never stored.
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                        {makePayment && (
                            <Button 
                                size="lg" 
                                className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 py-6 text-base" 
                                onClick={onRazorpayClick}
                            >
                                <SiRazorpay className="mr-2 w-5 h-5" />
                                Pay Now
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}