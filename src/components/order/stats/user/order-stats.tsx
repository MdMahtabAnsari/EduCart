"use client";
import { AnalyticsCard, AnalyticsCardSkeleton } from "@/components/card/analytics-card";
import { api } from "@/trpc/react";
import { Error } from "@/components/error/error";
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter";

export function OrderStats() {
    const { data: orders, isPending: pendingOrders, isError: isErrorOrders, refetch: refetchOrders, error: ordersError } = api.user.order.getMonthlyOrders.useQuery();
    const { data: spending, isPending: pendingSpending, isError: isErrorSpending, refetch: refetchSpending, error: spendingError } = api.user.order.getMonthlySpending.useQuery();
    const {data:avgSpending, isPending: pendingAvgSpending, isError: isErrorAvgSpending, refetch: refetchAvgSpending, error: avgSpendingError} = api.user.order.getMonthlyMothlyAverageSpending.useQuery();
    const {data:enrollments, isPending: pendingEnrollments, isError: isErrorEnrollments, refetch: refetchEnrollments, error: enrollmentsError} = api.user.enrollment.getMonthlyEnrollments.useQuery();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
                pendingOrders ? (
                    <AnalyticsCardSkeleton />
                ) : isErrorOrders ? (
                    <Error title="Error loading order stats" description={ordersError.message} onRetry={refetchOrders} />
                ) : (
                    <AnalyticsCard
                        title="This Month's Orders"
                        value={orders.thisMonthOrderCount}
                        percentage={orders.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Orders placed this month"
                    />
                )
            }
            {
                pendingSpending ? (
                    <AnalyticsCardSkeleton />
                ) : isErrorSpending ? (
                    <Error title="Error loading spending stats" description={spendingError.message} onRetry={refetchSpending} />
                ) : (
                    <AnalyticsCard
                        title="This Month's Spending"
                        value={formatCurrency(spending.thisMonthSpending, 'INR')}
                        percentage={spending.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Total spending this month"
                    />
                )
            }
            {
                pendingAvgSpending ? (
                    <AnalyticsCardSkeleton />
                ) : isErrorAvgSpending ? (
                    <Error title="Error loading average spending stats" description={avgSpendingError.message} onRetry={refetchAvgSpending} />
                ) : (
                    <AnalyticsCard
                        title="This Month's Avg. Spending"
                        value={formatCurrency(avgSpending.thisMonthAverageSpending, 'INR')}
                        percentage={avgSpending.percentageChange}
                        trendLabel="Trend's compared to last month"
                        footerText="Average spending per order this month"
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
        </div>
    );
}