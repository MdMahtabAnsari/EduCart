import { Card, CardContent } from "@/components/ui/card";
import { CartRouterOutputs } from "@/server/api/routers/user/cart";
import { Media } from "@/components/media/media";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter";

export interface CartItemProps {
    item: CartRouterOutputs["getCartItems"]["items"][number];
    onRemove: (itemId: string) => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
    const { course } = item;
    const { title, media, price, offerPrice, isFree } = course;

    const finalPrice = isFree ? 0 : offerPrice ?? price;

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
                                <span className="text-green-600 font-medium">Free</span>
                            ) : (
                                <span className="text-primary font-semibold">
                                    {formatCurrency(Number(finalPrice), 'INR')}
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Remove button */}
                    <div className="flex justify-end sm:justify-start mt-3 sm:mt-0">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onRemove(item.courseId)}
                            className="flex items-center gap-1 w-fit"
                        >
                            <Trash className="w-4 h-4" />
                            Remove
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
