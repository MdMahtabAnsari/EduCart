"use client";

import { CartItem } from "@/components/cart/cart-item";
import { Button } from "@/components/ui/button";
import { CartRouterOutputs } from "@/server/api/routers/user/cart";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ShoppingBag, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter";
import Link from "next/link";

interface CartItemListProps {
    cart: CartRouterOutputs["getCartItems"];
}

export function CartItemList({ cart }: CartItemListProps) {
    const { items, totalAmount } = cart;
    const router = useRouter();

    const removeCartItemMutation = api.user.cart.removeFromCart.useMutation();
    const createOrderMutation = api.user.order.createOrderByCart.useMutation();

    const handleRemove = (itemId: string) => {
        toast.promise(
            removeCartItemMutation.mutateAsync(itemId, {
                onSuccess: () => {
                    router.refresh();
                }
            }),
            {
                loading: "Removing item...",
                success: "Item removed from cart!",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    const handleCheckout = () => {
        toast.promise(
            createOrderMutation.mutateAsync(undefined, {
                onSuccess: (order) => {
                    if (Number(order.totalAmount) === 0) {
                        router.push(`/user/courses/enrollments`);
                    } else {
                        router.push(`/user/orders/${order.id}/payments`);
                    }
                }
            }),
            {
                loading: "Preparing secure checkout...",
                success: "Redirecting to payment...",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    const isCheckingOut = createOrderMutation.isPending;

    // Graceful Empty State
    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed rounded-3xl bg-muted/5 animate-in fade-in duration-500">
                <div className="bg-background p-6 rounded-full shadow-lg mb-6">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Your cart is empty</h2>
                <p className="text-muted-foreground mt-2 mb-8 max-w-sm">
                    Looks like you haven&apos;t added any courses to your cart yet. Explore our catalog to find your next learning journey.
                </p>
                <Link href="/courses">
                    <Button size="lg" className="font-semibold shadow-md cursor-pointer">
                        Browse Courses <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
            
            {/* Left Column: Cart Items Feed */}
            <div className="flex-2 space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight">Your Cart</h2>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {items.length} {items.length === 1 ? 'Course' : 'Courses'}
                    </span>
                </div>

                <div className="flex flex-col gap-4">
                    {items.map((item) => (
                        <CartItem key={item.id} item={item} onRemove={handleRemove} />
                    ))}
                </div>
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="flex-1">
                <Card className="sticky top-6 border-none shadow-xl bg-card/40 backdrop-blur-md ring-1 ring-border/50 rounded-2xl">
                    <CardHeader className="pb-4 border-b border-border/40">
                        <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Original Price</span>
                                <span>{formatCurrency(totalAmount, 'INR')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Discounts</span>
                                <span className="text-emerald-600 font-medium">Included in items</span>
                            </div>
                        </div>
                        
                        <Separator className="bg-border/60" />
                        
                        <div className="flex justify-between items-center py-2">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-3xl font-black text-primary tabular-nums">
                                {totalAmount === 0 ? "Free" : formatCurrency(totalAmount, 'INR')}
                            </span>
                        </div>

                        {/* Trust Badge */}
                        <div className="bg-primary/5 rounded-lg p-3 flex items-start gap-3 border border-primary/10 mt-4">
                            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                You will be redirected to our secure payment gateway to complete your purchase safely.
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-2 pb-6">
                        <Button 
                            size="lg" 
                            onClick={handleCheckout} 
                            disabled={isCheckingOut}
                            className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 py-6 text-base cursor-pointer"
                        >
                            {isCheckingOut ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Secure Checkout
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}