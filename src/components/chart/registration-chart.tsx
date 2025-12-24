"use client"
import { GenericAreaChart, GenericAreaChartSkeleton } from "@/components/chart/chart-area-intrective";
import { useState } from "react";
import { api } from "@/trpc/react";
import { DayEnum } from "@/lib/schema/day";
import { Error } from "@/components/error/error";

interface EarningChartProps {
    role: string;
}
export function RegistrationChart({ }: EarningChartProps) {
    const [timeRange, setTimeRange] = useState<DayEnum>("30");
    const { data, isPending, isError, error, refetch } = api.admin.chart.getRegistrationsOverTime.useQuery(timeRange);
    if (isPending || !data) {
        return <GenericAreaChartSkeleton />;
    }
    if (isError) {
        return <Error title="Error while loading Stats" description={error.message} onRetry={refetch} />;
    }

    const onTimeRangeChange = (value: string) => {
        setTimeRange(value as DayEnum);
    }
    return (

        <GenericAreaChart
            data={data}
            series={[
                { key: "users", label: "Users", colorVar: "--chart-1" },
                { key: "instructors", label: "Instructors", colorVar: "--chart-2" },
                { key: "admins", label: "Admins", colorVar: "--chart-3" },
            ]}
            title="Registrations Over Time"
            description="Total registrations over time."
            initialTimeRange={timeRange}
            onTimeRangeChange={onTimeRangeChange}
        />
    );
}