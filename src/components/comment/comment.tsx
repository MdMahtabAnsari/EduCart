"use client";

import { CommentRouterOutputs } from "@/server/api/routers/common/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, Reply, EllipsisVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
    const { content, user, createdAt, likes, dislikes, id, lessonId, liked, disliked, permissions } = comment;
    const { canDelete } = permissions;
    const { name, image, role } = user;

    const date = createdAt.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
    });

    const isInstructor = role === "TEACHER" || role === "ADMIN";

    return (
        <article className="group flex gap-4 py-4 border-b border-border/40 last:border-0 animate-in fade-in duration-500">
            {/* Avatar Column */}
            <div className="shrink-0 pt-1">
                <Avatar className="w-10 h-10 border ring-2 ring-transparent group-hover:ring-border/60 transition-all">
                    <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Content Column */}
            <div className="flex flex-col flex-1 min-w-0">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span className="text-sm font-bold text-foreground">
                            {name}
                        </span>
                        
                        {role && (
                            <Badge 
                                variant={isInstructor ? "default" : "secondary"} 
                                className={cn(
                                    "text-[10px] uppercase font-bold tracking-wider px-1.5 h-4 border-none",
                                    isInstructor ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-muted text-muted-foreground"
                                )}
                            >
                                {role.replace("_", " ")}
                            </Badge>
                        )}

                        <span className="text-xs font-medium text-muted-foreground/60 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
                            {date}
                        </span>
                    </div>

                    {/* Actions Menu */}
                    {canDelete && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 -mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <EllipsisVertical className="w-4 h-4" />
                                    <span className="sr-only">Comment options</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem 
                                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" 
                                    onClick={() => onDelete(id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Comment
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Comment Body */}
                <div className="text-sm text-foreground/90 leading-relaxed mb-3 wrap-break-word pr-4">
                    {content}
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-1 -ml-2">
                    
                    {/* Reaction Pill */}
                    <div className="flex items-center bg-muted/30 rounded-full p-0.5 border border-transparent group-hover:border-border/50 transition-colors">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-7 px-3 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-muted text-muted-foreground transition-all",
                                liked && "text-primary hover:text-primary bg-primary/10 hover:bg-primary/20"
                            )}
                            onClick={() => liked ? onUnLike(id, lessonId) : onLike(id, lessonId)}
                        >
                            <ThumbsUp className={cn("w-3.5 h-3.5", liked && "fill-current")} />
                            <span className="text-xs font-semibold">{likes > 0 ? likes : ""}</span>
                        </Button>
                        
                        <div className="w-px h-3.5 bg-border/60 mx-0.5" />

                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-7 px-3 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-muted text-muted-foreground transition-all",
                                disliked && "text-destructive hover:text-destructive bg-destructive/10 hover:bg-destructive/20"
                            )}
                            onClick={() => disliked ? onUnDislike(id, lessonId) : onDislike(id, lessonId)}
                        >
                            <ThumbsDown className={cn("w-3.5 h-3.5 mt-0.5", disliked && "fill-current")} />
                            <span className="text-xs font-semibold">{dislikes > 0 ? dislikes : ""}</span>
                        </Button>
                    </div>

                    {/* Reply Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 ml-1 rounded-full flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        onClick={() => onReply(id)}
                    >
                        <Reply className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">Reply</span>
                    </Button>
                </div>
            </div>
        </article>
    );
}