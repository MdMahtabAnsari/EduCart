import { OrderRouterOutputs } from "@/server/api/routers/user/order";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Media } from "@/components/media/media";
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter";

interface ProductProps {
    orderItem: OrderRouterOutputs["getOrderById"]["order"]["orderItems"][number];
}

export function Product({ orderItem }: ProductProps) {
    const { title, isFree, media } = orderItem.course;
    const { amount } = orderItem;

    return (
        <Card className="w-full overflow-hidden">
            <CardContent className="flex flex-col sm:flex-row w-full gap-4 p-4">

                {/* Thumbnail */}
                <div className="w-full sm:w-48 rounded-md overflow-hidden shrink-0">
                    <AspectRatio ratio={16 / 9} className="w-full h-full">
                        <Media
                            url={media.url}
                            type={media.type}
                            alt={title}
                            className="object-cover w-full h-full rounded-md"
                        />
                    </AspectRatio>
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                        <h3 className="text-lg font-semibold leading-tight line-clamp-2 wrap-break-word">
                            {title}
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Price:{" "}
                            {isFree ? (
                                <span className="font-medium text-green-600">Free</span>
                            ) : (
                                <span className="font-medium text-primary">
                                    {formatCurrency(amount, 'INR')}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
