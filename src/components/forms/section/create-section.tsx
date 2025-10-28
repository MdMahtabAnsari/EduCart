"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { sectionSchema, type SectionSchema } from "@/lib/schema/section";

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
import { FaPlusCircle } from "react-icons/fa";

interface CreateSectionFormProps {
    courseId: string;
}

export function CreateSectionForm({ courseId }: CreateSectionFormProps) {
    const form = useForm<SectionSchema>({
        resolver: zodResolver(sectionSchema),
        mode: "onChange",
    });

    const onSubmit = (data: SectionSchema) => {
        toast.success(`Section "${data.title}" created successfully!`);
        form.reset();
    };

    return (
        <Card className="w-full max-w-lg mx-auto shadow-lg border border-gray-200 bg-white h-fit">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                    <FaPlusCircle className="text-primary" />
                    Create New Section
                </CardTitle>
                <CardDescription className="text-gray-500">
                    Add a new section to your course.
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
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
                            className="w-full bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2 py-2 text-lg font-semibold rounded-md shadow"
                        >
                            <FaPlusCircle />
                            Create Section
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}