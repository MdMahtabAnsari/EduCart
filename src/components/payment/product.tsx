import { OrderRouterOutputs } from "@/server/api/routers/user/order";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Media } from "@/components/media/media";
import { formatCurrency } from "@/lib/helpers/formatter/currency-formatter";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductProps {
    orderItem: OrderRouterOutputs["getOrderById"]["order"]["orderItems"][number];
}

export function Product({ orderItem }: ProductProps) {
    const { title, isFree, media } = orderItem.course;
    const { amount } = orderItem;

    return (
        <Card className="group w-full overflow-hidden border-border/50 bg-card hover:border-primary/30 transition-all duration-300">
            <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-4">
                
                {/* Thumbnail Container */}
                <div className="w-full sm:w-44 shrink-0 relative rounded-lg overflow-hidden border border-border/40 shadow-sm">
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
                            <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-[10px] font-bold uppercase tracking-wider border-none">
                                Free
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Details Side */}
                <div className="flex flex-col justify-between flex-1 min-w-0 w-full py-1">
                    <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                    {title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>Course Enrollment</span>
                                </div>
                            </div>
                            
                            {/* Visual Confirmation */}
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Price Area */}
                        <div className="flex items-center gap-3 pt-2">
                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold shadow-sm border",
                                isFree 
                                    ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" 
                                    : "bg-primary/5 text-primary border-primary/10"
                            )}>
                                {!isFree && <IndianRupee className="w-3.5 h-3.5" />}
                                <span className="tabular-nums">
                                    {isFree ? "Free Access" : formatCurrency(amount, 'INR').replace('₹', '')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}