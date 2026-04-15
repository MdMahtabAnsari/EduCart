"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { filteredEnrollmentSchemaWithOptionalCourseId, type FilteredEnrollmentSchemaWithOptionalCourseId } from "@/lib/schema/enrollment";
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
import { Search, BookOpen, Activity, Filter } from "lucide-react";

export interface EnrollmentFilterFormProps {
    onSubmit: (values: FilteredEnrollmentSchemaWithOptionalCourseId) => void;
    defaultValues: FilteredEnrollmentSchemaWithOptionalCourseId;
    show: {
        courseId: boolean;
        search: boolean;
        status: boolean;
    }
}

export function EnrollmentFilterForm({ onSubmit, defaultValues, show }: EnrollmentFilterFormProps) {
    const { courseId, search, status } = show;
    
    const form = useForm<FilteredEnrollmentSchemaWithOptionalCourseId>({
        resolver: zodResolver(filteredEnrollmentSchemaWithOptionalCourseId),
        defaultValues,
        mode: "onChange",
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 pb-8">
                
                {/* Course Selection */}
                {courseId && (
                    <FormField
                        control={form.control}
                        name="courseId"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <BookOpen className="w-4 h-4" />
                                    Course
                                </FormLabel>
                                <FormControl>
                                    <CourseCombobox
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>Filter enrollments by a specific course.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Search Input */}
                {search && (
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <Search className="w-4 h-4" />
                                    Search Student
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
                                        <Input 
                                            placeholder="Name, email, or username..." 
                                            {...field} 
                                            className="pl-9 focus-visible:ring-primary bg-muted/20"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Status Selector */}
                {status && (
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <Activity className="w-4 h-4" />
                                    Enrollment Status
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="bg-muted/20 focus:ring-primary">
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="ALL">All</SelectItem>
                                            {Object.values(EnrollmentStatus).map((enrol) => (
                                                <SelectItem key={enrol} value={enrol}>
                                                    {/* Nicely formats enum strings like "IN_PROGRESS" to "In Progress" */}
                                                    {enrol.charAt(0) + enrol.slice(1).toLowerCase().replace(/_/g, ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Sticky-like bottom action */}
                <div className="pt-4 mt-4 border-t border-border/50">
                    <Button type="submit" size="lg" className="w-full cursor-pointer shadow-sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Apply Filters
                    </Button>
                </div>
            </form>
        </Form>
    );
}