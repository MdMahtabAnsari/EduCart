"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createReviewSchema, type CreateReviewSchema } from "@/lib/schema/review";
import { api } from "@/trpc/react";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

export interface CreateReviewProps {
    courseId: string;
    onSubmitSuccess?: () => void;
}

export function CreateReviewForm({ courseId, onSubmitSuccess }: CreateReviewProps) {
    const form = useForm<CreateReviewSchema>({
        resolver: zodResolver(createReviewSchema),
        defaultValues: {
            courseId: courseId,
            rating: 0,
            comment: '',
        },
        mode: "onChange",
    });
    const createReview = api.user.review.submitCourseReview.useMutation();
    const onSubmit = async (data: CreateReviewSchema) => {
        toast.promise(
            createReview.mutateAsync({...data,comment:data.comment?.trim()==='' ? undefined : data.comment}, {
                onSuccess: () => {
                    form.reset();
                    onSubmitSuccess?.();
                }
            }),
            {
                loading: "Submitting review...",
                success: "Review submitted successfully!",
                error: (err) => `Failed to submit review: ${err.message}`,
            }
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-medium">Rating</FormLabel>
                            <FormControl>
                                <Rating {...field} onValueChange={field.onChange} >
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <RatingButton className={index < field.value ? "text-green-500" : "text-muted-foreground"} key={index} />
                                    ))}
                                </Rating>
                            </FormControl>
                            <FormDescription>
                                Select a rating for the course.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-medium">Comment</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your comment"
                                    {...field}
                                    className="focus:ring-primary focus:border-primary/70 transition-all"
                                />
                            </FormControl>
                            <FormDescription>
                                Write your review comment here.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator />
                <Button
                    type="submit"
                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                    className="w-full cursor-pointer"
                >
                    <Plus />
                    Submit Review
                </Button>
            </form>
        </Form>
    );
}

export function CreateReview({ courseId, onSubmitSuccess }: CreateReviewProps) {
    return (
        <Card className="w-full border-none shadow-none bg-transparent">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Write a Review</CardTitle>
                <CardDescription>Share your thoughts about the course.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <CreateReviewForm courseId={courseId} onSubmitSuccess={onSubmitSuccess} />
            </CardContent>
        </Card>
    );
}