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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
// Assuming you have Textarea from standard shadcn/ui
import { Textarea } from "@/components/ui/textarea"; 
import { Separator } from "@/components/ui/separator";
import { Send, Loader2 } from "lucide-react";

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
    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (data: CreateReviewSchema) => {
        toast.promise(
            createReview.mutateAsync(
                { ...data, comment: data.comment?.trim() === '' ? undefined : data.comment }, 
                {
                    onSuccess: () => {
                        form.reset();
                        onSubmitSuccess?.();
                    }
                }
            ),
            {
                loading: "Submitting review...",
                success: "Review submitted successfully!",
                error: (err) => `Failed to submit review: ${err.message}`,
            }
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold">Overall Rating</FormLabel>
                            <FormControl>
                                <Rating {...field} onValueChange={field.onChange} className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <RatingButton 
                                            key={index}
                                            className={`w-6 h-6 transition-colors ${
                                                index < field.value 
                                                    ? "text-amber-500 fill-amber-500" 
                                                    : "text-muted-foreground/30 hover:text-amber-500/50"
                                            }`} 
                                        />
                                    ))}
                                </Rating>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold">Written Review (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="What did you think about this course?"
                                    className="resize-none min-h-25 focus-visible:ring-primary"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={!form.formState.isValid || isSubmitting}
                    className="w-full mt-2 transition-all"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Review
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
}

export function CreateReview({ courseId, onSubmitSuccess }: CreateReviewProps) {
    return (
        <Card className="w-full border shadow-sm bg-card">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold tracking-tight">Write a Review</CardTitle>
                <CardDescription>Share your experience to help other students.</CardDescription>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent>
                <CreateReviewForm courseId={courseId} onSubmitSuccess={onSubmitSuccess} />
            </CardContent>
        </Card>
    );
}