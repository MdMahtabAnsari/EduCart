"use client";
import { Review } from "@/components/review/review";
import { PaginationComponent } from "@/components/page/pagination";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Error } from "@/components/error/error";
import { Separator } from "@/components/ui/separator";
import { CreateReviewDialog } from "@/components/dialog/review/create-review-dialog";
import { toast } from "sonner";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ReviewListProps {
    courseId: string;
    role: string
}

export function ReviewList({ courseId, role }: ReviewListProps) {
    const [page, setPage] = useState(1);
    const limit = 10;

    const deleteRewviewMutation = api.user.review.deleteCourseReview.useMutation();

    const { data, isLoading, error, refetch } = api.common.review.filterdReviews.useQuery(
        {
            courseId,
            pageLimit: { page, limit },
        },
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

    return (
        <Card className="w-full h-fit shadow-none border-none bg-transparent">
            <CardHeader>

                <CardTitle>Course Reviews</CardTitle>
                <CardDescription>Read what our learners have to say about this course.</CardDescription>
            </CardHeader>
            <CardContent>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Spinner />
                    </div>
                ) : error ? (
                    <Error title="failed to load Reviews" description={error.message} onRetry={refetch} />
                ) : (
                    data?.reviews.map((review) => <Review key={review.id} review={review} onDelete={onDelete} />)
                )}
                {role === 'user' && (

                    <CreateReviewDialog courseId={courseId} onSubmitSuccess={onSubmitSuccess} trigger={
                        <div className="flex items-center justify-end">
                        <Button className="cursor-pointer" size="lg">
                            <Plus />
                            Write a Review
                        </Button>
                        </div>

                    } />

                )}
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