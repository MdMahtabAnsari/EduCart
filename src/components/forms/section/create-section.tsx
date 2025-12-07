"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createSectionSchema, CreateSectionSchema } from "@/lib/schema/section";
import { api } from "@/trpc/react";

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

export interface CreateSectionFormProps {
    courseId: string;
    onSubmission?: () => void;
}

export function CreateSectionForm({ courseId, onSubmission }: CreateSectionFormProps) {


    return (
        <Card className="w-full max-w-lg mx-auto h-fit">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                    <Plus className="text-primary" />
                    Create New Section
                </CardTitle>
                <CardDescription>
                    Add a new section to your course.
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <SectionForm courseId={courseId} onSubmission={onSubmission} />
            </CardContent>
        </Card>
    );
}


export function SectionForm({ courseId, onSubmission }: CreateSectionFormProps) {
    const form = useForm<CreateSectionSchema>({
        resolver: zodResolver(createSectionSchema),
        defaultValues: {
            courseId,
            title: "",
        },
        mode: "onChange",
    });
    const createSectionMutation = api.teacher.section.createSection.useMutation();

    const onSubmit = async (data: CreateSectionSchema) => {
        toast.promise(
            createSectionMutation.mutateAsync(data, {
                onSuccess: () => {
                    onSubmission?.();
                }
            }),
            {
                loading: "Creating section...",
                success: "Section created successfully!",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-medium">Section Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter section title"
                                    {...field}
                                    className="focus:ring-primary focus:border-primary/70 transition-all"
                                />
                            </FormControl>
                            <FormDescription>
                                Give your section a clear, descriptive name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                    className="w-full cursor-pointer"
                >
                    <Plus />
                    Create Section
                </Button>
            </form>
        </Form>
    )
}