"use client";
import { Comment } from "@/components/comment/comment";
import { PaginationComponent } from "@/components/page/pagination";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Error } from "@/components/error/error";
import { Separator } from "@/components/ui/separator";
import { CommentInput } from "@/components/comment/comment-input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export function CommentList({ lessonId }: { lessonId: string }) {
    const [page, setPage] = useState(1);
    const limit = 10;
    const [parentIds, setParentIds] = useState<string[]>([]);

    const createCommentMutation = api.common.comment.createComment.useMutation();
    const deleteCommentMutation = api.common.comment.deleteComment.useMutation();
    const likeCommentMutation = api.common.commentReaction.likeComment.useMutation();
    const dislikeCommentMutation = api.common.commentReaction.dislikeComment.useMutation();
    const unlikeCommentMutation = api.common.commentReaction.unLikeComment.useMutation();
    const undislikeCommentMutation = api.common.commentReaction.unDislikeComment.useMutation();

    const { data, isLoading, error, refetch } = api.common.comment.filterComments.useQuery(
        {
            lessonId,
            pageLimit: { page, limit },
            parentId: parentIds.length > 0 ? parentIds[parentIds.length - 1] : undefined,
        },
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
        setPage(1);
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
                    setPage(1);
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
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Spinner />
                    </div>
                ) : error ? (
                    <Error title="Failed to load comments" description={error.message} onRetry={refetch} />
                ) : (
                    data?.comments.map((comment) => <Comment key={comment.id} comment={comment} onReply={onReply} onDislike={onDislike} onLike={onLike} onUnLike={onUnLike} onUnDislike={onUnDislike} onDelete={onDelete} />)
                )}
                <CommentInput lessonId={lessonId} parentId={parentIds.length > 0 ? parentIds[parentIds.length - 1] : undefined} onCommentAdded={onCommentAdded} />
            </CardContent>
            {
                data && data.pagination.totalPages > 1 && (
                    <>
                        <Separator />
                        <PaginationComponent
                            pageDetails={data.pagination}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </>
                )
            }
        </Card>
    );
}