"use client";

import { SendHorizontal } from 'lucide-react';
import { createCommentSchema, type CreateCommentSchema } from '@/lib/schema/comment';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

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

    // Watch content to dynamically style the send button when the user starts typing
    const content = useWatch({ control: form.control, name: "content" });
    const hasContent = content.trim().length > 0;
    const isReply = !!parentId;

    const onSubmit = async (data: CreateCommentSchema) => {
        onCommentAdded({ lessonId, parentId, content: data.content });
        form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="sr-only">
                                {isReply ? "Write a reply" : "Write a comment"}
                            </FormLabel>
                            
                            {/* Unified Chat Bar Wrapper */}
                            <div className={cn(
                                "relative flex items-center w-full rounded-full border border-border/60 bg-muted/20 p-1 transition-all duration-300 shadow-sm",
                                "focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 focus-within:bg-background"
                            )}>
                                <FormControl>
                                    <Input
                                        placeholder={isReply ? "Write a reply..." : "Add to the discussion..."}
                                        className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 px-4 placeholder:text-muted-foreground/60 h-10"
                                        autoComplete="off"
                                        {...field}
                                    />
                                </FormControl>
                                
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                                    className={cn(
                                        "shrink-0 rounded-full h-9 w-9 transition-all duration-300 group cursor-pointer",
                                        hasContent 
                                            ? "bg-primary text-primary-foreground shadow-md hover:scale-105" 
                                            : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <SendHorizontal className={cn(
                                        "w-4 h-4 transition-transform duration-300",
                                        hasContent && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    )} />
                                </Button>
                            </div>
                            
                            {/* Error Message (Positioned safely below the pill) */}
                            <FormMessage className="pl-4 text-xs font-medium" />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}