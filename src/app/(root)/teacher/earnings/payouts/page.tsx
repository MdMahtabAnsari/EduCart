import { EarningChart } from "@/components/chart/earning-chart"
import { OrderTable } from "@/components/table/order/teacher/order"
export default function Page() {
    return (
        <div className="w-full h-full space-y-4">
            <EarningChart role="teacher" />
            <OrderTable />
        </div>
    )
}