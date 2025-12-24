"use client";
import { AnalyticsCard, AnalyticsCardSkeleton } from "@/components/card/analytics-card";
import { api } from "@/trpc/react";
import { Error } from "@/components/error/error";
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter";

export function AdminStats() {
    const { data: totalRevenue, isPending: pendingTotalRevenue, isError: isErrorTotalRevenue, refetch: refetchTotalRevenue, error: totalRevenueError } = api.admin.order.getTotalRevenue.useQuery();
    const { data: revenue, isPending: pendingRevenue, isError: isErrorRevenue, refetch: refetchRevenue, error: revenueError } = api.admin.order.getMonthlyRevenue.useQuery();
    const { data: enrollments, isPending: pendingEnrollments, isError: isErrorEnrollments, refetch: refetchEnrollments, error: enrollmentsError } = api.admin.enrollment.getMonthlyEnrollments.useQuery();
    const { data: uniqueStudents, isPending: pendingUniqueStudents, isError: isErrorUniqueStudents, refetch: refetchUniqueStudents, error: uniqueStudentsError } = api.admin.enrollment.getMonthlyUniqueStudents.useQuery();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
                pendingTotalRevenue ? (
                    <AnalyticsCardSkeleton />
                ) : isErrorTotalRevenue ? (
                    <Error title="Error loading course stats" description={totalRevenueError.message} onRetry={refetchTotalRevenue} />
                ) : (
                    <AnalyticsCard
                        title="Total Revenue"
                        value={formatCurrency(totalRevenue.totalRevenue, 'INR')}
                        footerText="Total revenue earned till date"
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