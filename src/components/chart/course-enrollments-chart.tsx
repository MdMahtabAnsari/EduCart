"use client"
import { GenericAreaChart,GenericAreaChartSkeleton } from "@/components/chart/chart-area-intrective";
import { useState } from "react";
import {api} from "@/trpc/react";
import { DayEnum } from "@/lib/schema/day";
import { Error } from "@/components/error/error";

interface CourseEnrollmentsChartProps {
    role:string;
}

export function CourseEnrollmentsChart({}: CourseEnrollmentsChartProps) {
    const [timeRange, setTimeRange] = useState<DayEnum>("30");

    const { data,isPending,isError,error,refetch } = api.teacher.chart.getCourseEnrollmentsOverTime.useQuery(timeRange);

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
                { key: "enrollments", label: "Enrollments", colorVar: "--chart-1" },
                { key: "courses", label: "Courses", colorVar: "--chart-2" },
            ]}
            title="Course Enrollments Over Time"
            description="Number of course enrollments over time."
            initialTimeRange={timeRange}
            onTimeRangeChange={onTimeRangeChange}
        />
    );
}