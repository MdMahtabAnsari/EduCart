"use client";
import { Comment } from "@/components/comment/comment";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { CommentInput } from "@/components/comment/comment-input";

interface InfiniteCommentProps {
    lessonId: string;
    courseId: string;
}

export function InfiniteComment({ lessonId, courseId }: InfiniteCommentProps) {
    const limit = 10;
    const { ref, inView } = useInView();
    const [parentIds, setParentIds] = useState<string[]>([]);

    const createCommentMutation = api.common.comment.createComment.useMutation();
    const deleteCommentMutation = api.common.comment.deleteComment.useMutation();
    const likeCommentMutation = api.common.commentReaction.likeComment.useMutation();
    const dislikeCommentMutation = api.common.commentReaction.dislikeComment.useMutation();
    const unlikeCommentMutation = api.common.commentReaction.unLikeComment.useMutation();
    const undislikeCommentMutation = api.common.commentReaction.unDislikeComment.useMutation();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
        api.common.comment.commentWithInfiniteScroll.useInfiniteQuery(
            {
                limit,
                courseId,
                lessonId,
                parentId: parentIds.length > 0 ? parentIds[parentIds.length - 1] : undefined,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
                initialCursor: undefined,
            }
        );

    const onLike = (id: string, lessonId: string) => {
        toast.promise(
            likeCommentMutation.mutateAsync({ commentId: id, lessonId }, {
                onSuccess: () => {
                    refetch();
                }
            }),
            {
                loading: "Liking comment...",
                success: "Comment liked successfully!",
                error: (err) => `Error: ${err.message}`,
            }
        )
    }
    const onDislike = (id: string, lessonId: string) => {
        toast.promise(
            dislikeCommentMutation.mutateAsync({ commentId: id, lessonId }, {
                onSuccess: () => {
                    refetch();
                }
            }),
            {
                loading: "Disliking comment...",
                success: "Comment disliked successfully!",
                error: (err) => `Error: ${err.message}`,
            }
        )
    }
    const onReply = (id: string) => {
        setParentIds((prev) => [...prev, id]);
    }
    const onUnLike = (id: string, lessonId: string) => {
        toast.promise(
            unlikeCommentMutation.mutateAsync({ commentId: id, lessonId }, {
                onSuccess: () => {
                    refetch();
                }
            }),
            {
                loading: "Removing like from comment...",
                success: "Like removed successfully!",
                error: (err) => `Error: ${err.message}`,
            }
        )
    }
    const onUnDislike = (id: string, lessonId: string) => {
        toast.promise(
            undislikeCommentMutation.mutateAsync({ commentId: id, lessonId }, {
                onSuccess: () => {
                    refetch();
                }
            }),
            {
                loading: "Removing dislike from comment...",
                success: "Dislike removed successfully!",
                error: (err) => `Error: ${err.message}`,
            }
        )
    }
    const onCommentAdded = ({ lessonId, parentId, content }: { lessonId: string; parentId?: string; content: string }) => {
        toast.promise(
            createCommentMutation.mutateAsync({ lessonId, parentId, content }, {
                onSuccess: () => {
                    refetch();
                }
            }),
            {
                loading: "Adding comment...",
                success: "Comment added successfully!",
                error: (err) => `Error: ${err.message}`,
            }
        )
    };
    const onDelete = (id: string) => {
        toast.promise(
            deleteCommentMutation.mutateAsync(id, {
                onSuccess: () => {
                    refetch();
                }
            }),
            {
                loading: "Deleting comment...",
                success: "Comment deleted successfully!",
                error: (err) => `Error: ${err.message}`,
            }
        )
    };
    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);

    // Flatten all loaded pages
    const flattenPages = data?.pages.flatMap((p) => p) ?? [];
    const comments = flattenPages.flatMap((p) => p.comments) ?? [];
    const canCreate = flattenPages.length > 0 ? flattenPages[0].permissions.canCreate : false;
    return (
        <Card className="w-full h-fit shadow-none border-none bg-transparent">
            <CardHeader>
                <div className="flex flex-col items-start justify-center gap-2">
                    <CardTitle>Comments</CardTitle>
                    <CardDescription>Read what others are saying about this lesson.</CardDescription>
                    {parentIds.length > 0 && (
                        <Button className="cursor-pointer" size="lg" onClick={() => {
                            setParentIds((prev) => prev.slice(0, -1));
                        }}>
                            <ArrowLeft />
                            Back
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="max-h-96 overflow-scroll scrollbar-hide">
                {
                    comments.map((comment) => <Comment key={comment.id} comment={comment} onReply={onReply} onDislike={onDislike} onLike={onLike} onUnLike={onUnLike} onUnDislike={onUnDislike} onDelete={onDelete} />)
                }
                <div ref={ref} className="flex justify-center my-4"
                >
                    {isFetchingNextPage ? (
                        <Spinner />
                    ) : !hasNextPage ? (
                        <div className="text-muted-foreground">No more comments to load</div>
                    ) : undefined}
                </div>
            </CardContent>
            <CardFooter>
                {canCreate && <CommentInput lessonId={lessonId} parentId={parentIds.length > 0 ? parentIds[parentIds.length - 1] : undefined} onCommentAdded={onCommentAdded} />}
            </CardFooter>
        </Card>
    );
}
