import { CommentRouterOutputs } from "@/server/api/routers/common/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, ThumbsDown, Reply,EllipsisVertical,Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CommentProps {
    comment: CommentRouterOutputs["filterComments"]["comments"][number];
    onLike: (id: string, lessonId: string) => void;
    onDislike: (id: string, lessonId: string) => void;
    onReply: (id: string) => void;
    onUnLike: (id: string, lessonId: string) => void;
    onUnDislike: (id: string, lessonId: string) => void;
    onDelete: (id: string) => void;
}

export function Comment({ comment, onLike, onDislike, onReply, onUnLike, onUnDislike, onDelete }: CommentProps) {
    const { content, user, createdAt, likes, dislikes, id, lessonId,liked,disliked,permissions } = comment;
    const { canDelete } = permissions;
    const { name, image,role } = user;

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
                                Delete Comment
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    </div>
                    <span className="text-xs text-muted-foreground">{date}</span>
                </div>
            </CardHeader>


            <CardContent className="pt-3 pb-1 text-sm text-foreground">
                {content}
            </CardContent>

            <CardFooter className="flex items-center gap-3 pt-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1 cursor-pointer ${liked ? 'text-blue-600' : ''}`}
                    onClick={() => liked ? onUnLike(id,lessonId) : onLike(id, lessonId)}
                >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs">{likes}</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1 cursor-pointer ${disliked ? 'text-red-600' : ''}`}
                    onClick={() => disliked ? onUnDislike(id,lessonId) : onDislike(id, lessonId)}
                >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-xs">{dislikes}</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 ml-auto cursor-pointer"
                    onClick={() => onReply(id)}
                >
                    <Reply className="w-4 h-4" />
                    <span className="text-xs">Reply</span>
                </Button>
            </CardFooter>
            <Separator />
        </Card>
    );
}
