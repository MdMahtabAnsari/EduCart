import { RegistrationChart } from "@/components/chart/registration-chart"
import { AdminStats } from "@/components/stats/admin-stats"
import { OrderTable } from "@/components/table/order/admin/order"
export default function Page(){
    return (
        <div className="w-full h-full space-y-4">
            <AdminStats />
            <RegistrationChart role="admin" />
            <OrderTable />
        </div>
    )
}