import { CourseEnrollmentsChart } from "@/components/chart/course-enrollments-chart"
import { TeacherStats } from "@/components/stats/teacher-stats"
import { OrderTable } from "@/components/table/order/teacher/order"
export default function Page() {
    return (
        <div className="w-full h-full space-y-4">
            <TeacherStats />
            <CourseEnrollmentsChart role="teacher" />
            <OrderTable />
        </div>
    )
}