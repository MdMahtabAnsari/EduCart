import { CartItemList } from "@/components/cart/cart-item-list";
import { api } from "@/trpc/server";
import { Error as ErrorComp } from "@/components/error/error";

export const dynamic = "force-dynamic";

export default async function Page() {
    let cart;
    try {
        cart = await api.user.cart.getCartItems();
    } catch (error) {
        console.error("Failed to load cart:", error);
        const message = error instanceof Error ? error.message : String(error);
        return <ErrorComp title="Failed to load cart" description={message} />;
    }
    return <CartItemList cart={cart} />;
}