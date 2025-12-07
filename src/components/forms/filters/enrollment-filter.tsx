"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { fiteredEnrollmentSchmeaWithOptionalCourseId, type FiteredEnrollmentSchmeaWithOptionalCourseId } from "@/lib/schema/enrollment";
import { EnrollmentStatus } from "@/generated/prisma/enums";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CourseCombobox } from "@/components/combobox/course-combobox";

export interface EnrollmentFilterFormProps {
    onSubmit: (values: FiteredEnrollmentSchmeaWithOptionalCourseId) => void;
    defaultValues: FiteredEnrollmentSchmeaWithOptionalCourseId;
    show: {
        courseId: boolean;
        search: boolean;
        status: boolean;
    }
}

export function EnrollmentFilterForm({ onSubmit, defaultValues, show }: EnrollmentFilterFormProps) {
    const { courseId, search, status } = show;
    const form = useForm<FiteredEnrollmentSchmeaWithOptionalCourseId>({
        resolver: zodResolver(fiteredEnrollmentSchmeaWithOptionalCourseId),
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
                {status && (<FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Course Level</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Levels" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="ALL">All</SelectItem>
                                        {Object.values(EnrollmentStatus).map((enrol) => (
                                            <SelectItem key={enrol} value={enrol}>
                                                {enrol}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the enrollment status</FormDescription>
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

