import { SendHorizontal } from 'lucide-react';
import { createCommentSchema, type CreateCommentSchema } from '@/lib/schema/comment';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface CommentInputProps {
    lessonId: string;
    parentId?: string;
    onCommentAdded: ({ lessonId, parentId, content }: { lessonId: string; parentId?: string; content: string }) => void;
}
export function CommentInput({ lessonId, parentId, onCommentAdded }: CommentInputProps) {
    const form = useForm<CreateCommentSchema>({
        resolver: zodResolver(createCommentSchema),
        defaultValues: {
            content: '',
            lessonId,
            parentId,
        },
        mode: "onChange",
    });
    const onSubmit = async (data: CreateCommentSchema) => {
        onCommentAdded({ lessonId, parentId, content: data.content });
        form.reset();
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="w-full h-fit justify-center items-center flex gap-2">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="flex-1 mb-0">
                                <FormLabel className="sr-only">Comment</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Write a comment..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        variant="ghost"
                        className=' cursor-pointer'
                        disabled={!form.formState.isValid || form.formState.isSubmitting}
                    >
                        <SendHorizontal className="w-4 h-4" />
                    </Button>
                </div>
                <FormDescription className="mt-2">Enter your comment here.</FormDescription>
            </form>
        </Form>
    );
}