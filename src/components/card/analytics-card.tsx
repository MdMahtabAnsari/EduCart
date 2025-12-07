import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface AnalyticsCardProps {
    title: string
    value: string | number
    percentage?: number
    trendLabel?: string
    footerText?: string
    prefix?: string
    suffix?: string
}

export function AnalyticsCard({
    title,
    value,
    percentage,
    trendLabel,
    footerText,
    prefix,
    suffix
}: AnalyticsCardProps) {
    const isPositive = percentage !== undefined && percentage >= 0

    return (
        <Card className="w-full bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>

                {percentage !== undefined && (
                    <Badge
                        variant="secondary"
                        className={`px-2 py-1 flex items-center gap-1 ${isPositive ? "text-green-500" : "text-red-500"
                            }`}
                    >
                        {isPositive ? (
                            <ArrowUpRight className="h-3 w-3" />
                        ) : (
                            <ArrowDownRight className="h-3 w-3" />
                        )}
                        {percentage}%
                    </Badge>
                )}
            </CardHeader>

            <CardContent>
                <p className="text-3xl font-semibold">{prefix}{value}{suffix}</p>

                {trendLabel && (
                    <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{trendLabel}</span>
                        {isPositive ? (
                            <ArrowUpRight className="h-4 w-4" />
                        ) : (
                            <ArrowDownRight className="h-4 w-4" />
                        )}
                    </div>
                )}

                {footerText && (
                    <p className="text-xs mt-2 text-muted-foreground">{footerText}</p>
                )}
            </CardContent>
        </Card>
    )
}



export function AnalyticsCardSkeleton() {
    return (
        <Card className="w-full bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                {/* Title skeleton */}
                <Skeleton className="h-4 w-24" />

                {/* Badge skeleton */}
                <Skeleton className="h-5 w-12 rounded-md" />
            </CardHeader>

            <CardContent>
                {/* Value skeleton */}
                <Skeleton className="h-8 w-32 mb-3" />

                {/* Trend text skeleton */}
                <Skeleton className="h-4 w-40 mb-2" />

                {/* Footer text skeleton */}
                <Skeleton className="h-3 w-32" />
            </CardContent>
        </Card>
    )
}

