import {api} from '@/trpc/server';
import { OrderList } from '@/components/payment/order-list';
import {Error as ErrorComponent} from "@/components/error/error";

export default async function OrderPage({ params }: { params:Promise<{ orderId: string }> }) {
    let orderDetails;
    try {
        const { orderId } = await params;
        orderDetails = await api.user.order.getOrderById(orderId)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return <ErrorComponent title="Error Loading Order" description={errorMessage} />;
    }

    return (
            <OrderList order={orderDetails} />
    );
}