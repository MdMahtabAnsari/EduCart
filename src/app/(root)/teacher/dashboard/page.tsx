import { CourseEnrollmentsChart } from "@/components/chart/course-enrollments-chart"
import { TeacherStats } from "@/components/dashboard/teacher-stats"
import { OrderTable } from "@/components/table/order/teacher/order"
export default async function Page() {
    return (
        <div className="w-full h-full space-y-4">
            <TeacherStats />
            <CourseEnrollmentsChart role="teacher" />
            <OrderTable />
        </div>
    )
}