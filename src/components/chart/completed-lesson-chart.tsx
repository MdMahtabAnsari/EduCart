"use client"
import { GenericAreaChart, GenericAreaChartSkeleton } from "@/components/chart/chart-area-intrective";
import { useState } from "react";
import { api } from "@/trpc/react";
import { DayEnum } from "@/lib/schema/day";
import { Error } from "@/components/error/error";

interface EarningChartProps {
    role: string;
}
export function CompletedLessonChart({ }: EarningChartProps) {
    const [timeRange, setTimeRange] = useState<DayEnum>("30");
    const { data, isPending, isError, error, refetch } = api.user.chart.getCompletedLessonsOverTime.useQuery(timeRange);
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
                { key: "completedLessons", label: "Completed Lessons", colorVar: "--chart-1" },
            ]}
            title="Completed Lessons Over Time"
            description="Total completed lessons over time."
            initialTimeRange={timeRange}
            onTimeRangeChange={onTimeRangeChange}
        />
    );
}