"use client";
import { CartItem } from "@/components/cart/cart-item";
import { Button } from "@/components/ui/button";
import { CartRouterOutputs } from "@/server/api/routers/user/cart";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {ShoppingCart} from "lucide-react";
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter";

interface CartItemListProps {
    cart: CartRouterOutputs["getCartItems"];
}
export function CartItemList({ cart }: CartItemListProps) {
    const { items, totalAmount } = cart;
    const removeCartItemMutation = api.user.cart.removeFromCart.useMutation();
    const createOrderMutation = api.user.order.createOrderByCart.useMutation();
    const router = useRouter();

    const handleRemove = (itemId: string) => {
        toast.promise(
            removeCartItemMutation.mutateAsync(itemId, {
                onSuccess: () => {
                    router.refresh();
                }
            }),
            {
                loading: "Removing item from cart...",
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

                    }
                    else {
                        router.push(`/user/orders/${order.id}/payments`);
                    }
                }
            }),
            {
                loading: "Processing your order...",
                success: "Order placed successfully!",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    return (
        <Card className="w-full h-fit shadow-none border-none bg-transparent">
            <CardHeader>
                <CardTitle>Your Cart</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {items.map((item) => (
                    <CartItem key={item.id} item={item} onRemove={handleRemove} />
                ))}
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between items-center">
                <div className="text-lg font-semibold">
                    Total: {formatCurrency(totalAmount, 'INR')}
                </div>
                <Button size="lg" onClick={handleCheckout} className="cursor-pointer">
                    <ShoppingCart  />
                    Checkout
                </Button>
            </CardFooter>
        </Card>
    );
}