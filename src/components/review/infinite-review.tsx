"use client";
import { Review } from "@/components/review/review";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { CreateReviewDialog } from "@/components/dialog/review/create-review-dialog";
import { toast } from "sonner";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";

interface ReviewListProps {
    courseId: string;
    role: string
}

export function InfiniteReview({ courseId }: ReviewListProps) {
    const limit = 10;
    const { ref, inView } = useInView();

    const deleteRewviewMutation = api.user.review.deleteCourseReview.useMutation();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = api.common.review.reviewWithInfiniteScroll.useInfiniteQuery(
        {
            courseId,
            limit,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            initialCursor: undefined,
        }
    );
    const onDelete = (id: string) => {
        toast.promise(
            deleteRewviewMutation.mutateAsync(id, {
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
    const onSubmitSuccess = () => {
        refetch();
    }

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);

    const flattenPages = data?.pages.flatMap((p) => p) ?? [];
    const reviews = flattenPages.flatMap((p) => p.reviews) ?? [];
    const canCreate = flattenPages.length > 0 ? flattenPages[0].permissions.canCreate : false;

    return (
        <Card className="w-full h-fit shadow-none border-none bg-transparent">
            <CardHeader>

                <CardTitle>Course Reviews</CardTitle>
                <CardDescription>Read what our learners have to say about this course.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-96 overflow-scroll scrollbar-hide">
                {
                    reviews.map((review) => <Review key={review.id} review={review} onDelete={onDelete} />)
                }
                <div ref={ref} className="flex justify-center my-4"
                >
                    {isFetchingNextPage ? (
                        <Spinner />
                    ) : !hasNextPage ? (
                        <div className="text-muted-foreground">No more reviews to load</div>
                    ) : undefined}
                </div>
            </CardContent>
            <CardFooter className="w-full flex justify-end ">
                {canCreate && (
                    <CreateReviewDialog courseId={courseId} onSubmitSuccess={onSubmitSuccess} trigger={
                        <Button className="cursor-pointer" size="lg">
                            <Plus />
                            Write a Review
                        </Button>

                    } />

                )
                }
            </CardFooter>
        </Card>
    );
}