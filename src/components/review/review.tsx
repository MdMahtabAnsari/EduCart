import { ReviewRouterOutputs } from "@/server/api/routers/common/review";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReviewProps {
    review: ReviewRouterOutputs['filterdReviews']['reviews'][number];
    onDelete: (id: string) => void;
}

export function Review({ review, onDelete }: ReviewProps) {
    const { comment, user, createdAt, rating, id, permissions } = review;
    const { canDelete } = permissions;
    const { name, image, role } = user;
    
    const date = createdAt.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="w-full flex flex-col gap-4 py-4">
            <Card className="w-full border-none shadow-none bg-transparent">
                {/* Header Section */}
                <CardHeader className="flex flex-row items-start space-x-4 p-0 pb-3">
                    <Avatar className="w-10 h-10 border border-border/50">
                        <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {name?.[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col flex-1 gap-1">
                        <div className="flex items-start justify-between w-full">
                            <div className="flex flex-wrap items-center gap-2">
                                <CardTitle className="text-base font-semibold tracking-tight">
                                    {name}
                                </CardTitle>
                                {role && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 uppercase tracking-wider bg-secondary/50">
                                        {role}
                                    </Badge>
                                )}
                            </div>
                            
                            {canDelete && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground -mt-1 -mr-2">
                                            <EllipsisVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem 
                                            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" 
                                            onClick={() => onDelete(id)}
                                        >
                                            <Trash className="w-4 h-4 mr-2" />
                                            Delete Review
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* Rating and Date inline */}
                        <div className="flex items-center gap-2.5 mt-0.5">
                            <Rating value={rating} readOnly className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <RatingButton 
                                        key={index}
                                        className={`w-3.5 h-3.5 ${
                                            index < rating 
                                                ? "text-amber-500 fill-amber-500" 
                                                : "text-muted-foreground/30"
                                        }`} 
                                    />
                                ))}
                            </Rating>
                            <span className="text-xs text-muted-foreground font-medium">
                                &middot; {date}
                            </span>
                        </div>
                    </div>
                </CardHeader>

                {/* Comment Section */}
                {comment && (
                    <CardContent className="p-0 pl-14 pb-2">
                        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                            {comment}
                        </p>
                    </CardContent>
                )}
            </Card>
            
            <Separator className="bg-border/60" />
        </div>
    );
}