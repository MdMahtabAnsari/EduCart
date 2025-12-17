"use client"
import { GenericAreaChart, GenericAreaChartSkeleton } from "@/components/chart/chart-area-intrective";
import { useState } from "react";
import { api } from "@/trpc/react";
import { DayEnum } from "@/lib/schema/day";
import { Error } from "@/components/error/error";

interface EarningChartProps {
    role: string;
}
export function EarningChart({ }: EarningChartProps) {
    const [timeRange, setTimeRange] = useState<DayEnum>("30");
    const { data, isPending, isError, error, refetch } = api.teacher.chart.getEarningOverTime.useQuery(timeRange);
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
                { key: "earnings", label: "Earnings", colorVar: "--chart-1" },
            ]}
            title="Earnings Over Time"
            description="Total earnings over time."
            initialTimeRange={timeRange}
            onTimeRangeChange={onTimeRangeChange}
        />
    );
}