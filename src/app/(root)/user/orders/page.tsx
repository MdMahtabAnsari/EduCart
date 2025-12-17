import { OrderTable } from "@/components/table/order/user/order";
import { OrderStats } from "@/components/order/stats/user/order-stats";

export default function Page() {
    return (
        <div className="w-full h-full space-y-4">
            <OrderStats />
            <OrderTable />
        </div>
    )
}