"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CartRouterOutputs } from "@/server/api/routers/user/cart";
import { Media } from "@/components/media/media";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter";
import { Badge } from "@/components/ui/badge";

export interface CartItemProps {
    item: CartRouterOutputs["getCartItems"]["items"][number];
    onRemove: (itemId: string) => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
    const { course } = item;
    const { title, media, price, offerPrice, isFree } = course;

    const finalPrice = isFree ? 0 : offerPrice ?? price;
    const hasDiscount = !isFree && offerPrice !== null && offerPrice < price;

    return (
        <Card className="group w-full overflow-hidden border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300">
            <CardContent className="flex flex-col sm:flex-row w-full gap-6 p-4">
                
                {/* Thumbnail Section */}
                <div className="w-full sm:w-48 shrink-0 relative rounded-lg overflow-hidden border border-border/40 shadow-sm">
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                        <Media
                            url={media.url}
                            type={media.type}
                            alt={title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                    </AspectRatio>
                    {isFree && (
                        <div className="absolute top-2 left-2">
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] font-bold uppercase tracking-wider border-none">
                                Free
                            </Badge>
                        </div>
                    )}
                    {hasDiscount && (
                        <div className="absolute top-2 left-2">
                            <Badge className="bg-primary hover:bg-primary/90 text-[10px] font-bold uppercase tracking-wider border-none">
                                <Tag className="w-3 h-3 mr-1" />
                                Sale
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
                    <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                    {title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                                    <ShoppingCart className="w-3.5 h-3.5" />
                                    <span>Course Item</span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Logic */}
                        <div className="flex items-baseline gap-2">
                            {isFree ? (
                                <span className="text-xl font-black text-emerald-600 tabular-nums">Free</span>
                            ) : (
                                <>
                                    <span className="text-xl font-black text-primary tabular-nums">
                                        {formatCurrency(Number(finalPrice), 'INR')}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-sm text-muted-foreground line-through opacity-70">
                                            {formatCurrency(Number(price), 'INR')}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex justify-end pt-4 sm:pt-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(item.courseId)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all group/btn"
                        >
                            <Trash2 className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
                            <span className="text-xs font-bold uppercase tracking-widest">Remove</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}