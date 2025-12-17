"use client";
import { AnalyticsCard, AnalyticsCardSkeleton } from "@/components/card/analytics-card";
import { api } from "@/trpc/react";
import { Error } from "@/components/error/error";
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter";

export function TeacherStats() {
    const { data: courses, isPending: pendingCourses, isError: isErrorCourses, refetch: refetchCourses, error: coursesError } = api.teacher.course.getMonthlyCourses.useQuery();
    const { data: revenue, isPending: pendingRevenue, isError: isErrorRevenue, refetch: refetchRevenue, error: revenueError } = api.teacher.order.getMonthlyRevenue.useQuery();
    const { data: enrollments, isPending: pendingEnrollments, isError: isErrorEnrollments, refetch: refetchEnrollments, error: enrollmentsError } = api.teacher.enrollment.getMonthlyEnrollments.useQuery();
    const { data: uniqueStudents, isPending: pendingUniqueStudents, isError: isErrorUniqueStudents, refetch: refetchUniqueStudents, error: uniqueStudentsError } = api.teacher.enrollment.getMonthlyUniqueStudents.useQuery();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
                pendingCourses ? (
                    <AnalyticsCardSkeleton />
                ) : isErrorCourses ? (
                    <Error title="Error loading course stats" description={coursesError.message} onRetry={refetchCourses} />
                ) : (
                    <AnalyticsCard
                        title="This Month's Courses"
                        value={courses.thisMonthCourses}
                        percentage={courses.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Courses created this month"
                    />
                )
            }
            {
                pendingRevenue ? (
                    <AnalyticsCardSkeleton />
                ) : isErrorRevenue ? (
                    <Error title="Error loading revenue stats" description={revenueError.message} onRetry={refetchRevenue} />
                ) : (
                    <AnalyticsCard
                        title="This Month's Revenue"
                        value={formatCurrency(revenue.thisMonthRevenue, 'INR')}
                        percentage={revenue.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total revenue earned this month"
                    />
                )
            }
            {
                pendingEnrollments ? (
                    <AnalyticsCardSkeleton />
                ) : isErrorEnrollments ? (
                    <Error title="Error loading enrollment stats" description={enrollmentsError.message} onRetry={refetchEnrollments} />
                ) : (
                    <AnalyticsCard
                        title="This Month's Enrollments"
                        value={enrollments.thisMonthEnrollments}
                        percentage={enrollments.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total enrollments this month"
                    />
                )
            }
            {
                pendingUniqueStudents ? (
                    <AnalyticsCardSkeleton />
                ) : isErrorUniqueStudents ? (
                    <Error title="Error loading unique students stats" description={uniqueStudentsError.message} onRetry={refetchUniqueStudents} />
                ) : (
                    <AnalyticsCard
                        title="This Month's Unique Students"
                        value={uniqueStudents.thisMonthStudentsCount}
                        percentage={uniqueStudents.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total unique students this month"
                    />
                )
            }
        </div>
    );
}