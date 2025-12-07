"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type FilterInstructorCoursesSchema, filterInstructorCoursesSchema } from "@/lib/schema/instructor";
import { Button } from "@/components/ui/button";
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
import { CourseCombobox } from "@/components/combobox/course-combobox";

export interface InstructorFilterFormProps {
    onSubmit: (values: FilterInstructorCoursesSchema) => void;
    defaultValues: FilterInstructorCoursesSchema;
    show: {
        courseId: boolean;
        search: boolean;
    }
}

export function InstructorFilterForm({ onSubmit, defaultValues, show }: InstructorFilterFormProps) {
    const { courseId, search } = show;
    const form = useForm<FilterInstructorCoursesSchema>({
        resolver: zodResolver(filterInstructorCoursesSchema),
        defaultValues,
        mode: "onChange",
    });


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
                {courseId && (<FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Course</FormLabel>
                            <FormControl>
                                <CourseCombobox
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />)}
                {search && (<FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Search</FormLabel>
                            <FormControl>
                                <Input placeholder="Search by name, email, or username" {...field} />
                            </FormControl>
                            <FormDescription>Search by name, email, or username</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />)}
                <Button type="submit" className="w-full cursor-pointer">
                    Apply Filters
                </Button>
            </form>
        </Form>
    );
}

