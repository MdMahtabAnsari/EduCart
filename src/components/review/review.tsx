import { ReviewRouterOutputs } from "@/server/api/routers/common/review";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
} from "@/components/ui/dropdown-menu"

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
        formatMatcher: 'best fit',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    return (
        <Card className="w-full border-none shadow-none bg-transparent">
            <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <Avatar className="w-9 h-9">
                    <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
                    <AvatarFallback>{name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-medium">{name}</CardTitle>
                            {role && <Badge variant="outline" className="text-xs">{role}</Badge>}
                        </div>
                        {canDelete && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="cursor-pointer">
                                    <Button variant="ghost" size="icon" className="p-0">
                                        <EllipsisVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => onDelete(id)}>
                                        <Trash className="w-4 h-4 mr-2" />
                                        Delete Review
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground">{date}</span>
                </div>
            </CardHeader>
            {comment&& (
            <CardContent className="pt-3 pb-1 text-sm text-foreground">
                {comment}
            </CardContent>
            )}
            <CardFooter className="pt-0">
                <Rating value={rating} readOnly>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <RatingButton className={index < rating ? "text-green-500" : "text-muted-foreground"} key={index} />
                    ))}
                </Rating>
            </CardFooter>
            <Separator />
        </Card>
    );
}
