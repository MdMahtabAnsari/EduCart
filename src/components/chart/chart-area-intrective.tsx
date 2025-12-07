"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * FIXED TYPE — date is string, other properties are numbers
 */
export type ChartDatum = {
    date: string,
    [key: string]: number | string; // allow date + numeric fields
}

export type SeriesConfig = {
    key: string
    label: string
    colorVar: string
}

export type TimeRangeOption = {
    value: string
    label: string
    days: number
}

interface GenericAreaChartProps {
    data: ChartDatum[]
    series: SeriesConfig[]
    timeRanges?: TimeRangeOption[]
    title?: string
    description?: string
    initialTimeRange: string
    onTimeRangeChange: (value: string) => void
}

export function GenericAreaChart({
    data,
    series,
    timeRanges = [
        { value: "1", label: "1 Day", days: 1 },
        { value: "7", label: "7 Days", days: 7 },
        { value: "30", label: "30 Days", days: 30 },
        { value: "90", label: "90 Days", days: 90 },
        { value: "180", label: "180 Days", days: 180 },
        { value: "365", label: "1 Year", days: 365 },
        { value: "ALL", label: "All Time", days: 0 },
    ],
    title = "Interactive Area Chart",
    description = "Showing trends over time",
    initialTimeRange,
    onTimeRangeChange,
}: GenericAreaChartProps) {

    // Build ChartConfig dynamically
    const chartConfig: ChartConfig = series.reduce((acc, s) => {
        acc[s.key] = {
            label: s.label,
            color: `var(${s.colorVar})`,
        }
        return acc
    }, {} as ChartConfig)

    return (
            <Card className="pt-0">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                    <div className="grid flex-1 gap-1">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>

                    <Select value={initialTimeRange} onValueChange={onTimeRangeChange}>
                        <SelectTrigger className="hidden w-40 rounded-lg sm:ml-auto sm:flex">
                            <SelectValue placeholder={timeRanges[0].label} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {timeRanges.map((range) => (
                                <SelectItem key={range.value} value={range.value}>
                                    {range.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>

                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={data}>
                            <defs>
                                {series.map((s) => (
                                    <linearGradient
                                        key={s.key}
                                        id={`fill-${s.key}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={`var(${s.colorVar})`}
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={`var(${s.colorVar})`}
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                ))}
                            </defs>

                            <CartesianGrid vertical={false} />

                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                minTickGap={32}
                                tickFormatter={(value) =>
                                    new Date(value).toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        formatMatcher: "best fit",
                                    })
                                }
                            />

                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        indicator="dot"
                                        labelFormatter={(value) =>
                                            new Date(value).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                formatMatcher: "best fit",
                                            })
                                        }
                                    />
                                }
                            />

                            {series.map((s) => (
                                <Area
                                    key={s.key}
                                    dataKey={s.key}
                                    type="natural"
                                    fill={`url(#fill-${s.key})`}
                                    stroke={`var(${s.colorVar})`}
                                    stackId="stack"
                                />
                            ))}

                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
    )
}



export function GenericAreaChartSkeleton() {
    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>
                        <Skeleton className="h-5 w-40" />
                    </CardTitle>

                    <CardDescription>
                        <Skeleton className="h-4 w-56" />
                    </CardDescription>
                </div>

                {/* Time Range Select Skeleton */}
                <Skeleton className="hidden h-9 w-40 rounded-lg sm:flex" />
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {/* Chart area skeleton */}
                <Skeleton className="h-[250px] w-full rounded-lg" />
            </CardContent>
        </Card>
    )
}

