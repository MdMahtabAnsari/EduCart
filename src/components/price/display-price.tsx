import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter"

interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
    actualPrice: number
    offerPrice: number
}

export function PriceDisplay({ actualPrice, offerPrice, className }: PriceDisplayProps) {
    const discount = ((actualPrice - offerPrice) / actualPrice) * 100
    const discountPercent = Math.round(discount)

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* Offer Price */}
            <span className="text-lg font-semibold text-green-600">
                {formatCurrency(offerPrice, 'INR')}
            </span>

            {/* Actual Price */}
            <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(actualPrice, 'INR')}
            </span>

            {/* Discount */}
            {discount > 0 && (
                <Badge variant="secondary" className="text-xs font-medium text-red-600 bg-red-100">
                    {discountPercent}% OFF
                </Badge>
            )}
        </div>
    )
}
