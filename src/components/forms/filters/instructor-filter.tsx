"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type FilterInstructorCoursesWithOptionalCourseIdSchema, filterInstructorCoursesWithOptionalCourseIdSchema } from "@/lib/schema/instructor";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { InstructorPermission, InstructorStatus } from "@/generated/prisma/enums";
import { DualSlider } from "@/components/sliders/dual-slider";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, BookOpen, Shield, UserCheck, PieChart, Filter } from "lucide-react";

export interface InstructorFilterFormProps {
    onSubmit: (values: FilterInstructorCoursesWithOptionalCourseIdSchema) => void;
    defaultValues: FilterInstructorCoursesWithOptionalCourseIdSchema;
    show: {
        courseId: boolean;
        search: boolean;
        permissions: boolean;
        status: boolean;
        shareRange: boolean;
    }
}

export function InstructorFilterForm({ onSubmit, defaultValues, show }: InstructorFilterFormProps) {
    const { courseId, search, permissions, status, shareRange } = show;
    
    const form = useForm<FilterInstructorCoursesWithOptionalCourseIdSchema>({
        resolver: zodResolver(filterInstructorCoursesWithOptionalCourseIdSchema),
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
                                <FormDescription>Filter instructors by a specific course.</FormDescription>
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
                                    Search Instructor
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
                                    <UserCheck className="w-4 h-4" />
                                    Account Status
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="bg-muted/20 focus:ring-primary w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem key="ALL" value="ALL">All Statuses</SelectItem>
                                            {Object.values(InstructorStatus).map((statusOption) => (
                                                statusOption !== "REMOVED" && (
                                                    <SelectItem key={statusOption} value={statusOption}>
                                                        {statusOption.charAt(0) + statusOption.slice(1).toLowerCase().replace(/_/g, ' ')}
                                                    </SelectItem>
                                                )
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Permissions Cards */}
                {permissions && (
                    <FormField
                        control={form.control}
                        name="permissions"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <Shield className="w-4 h-4" />
                                    Instructor Permissions
                                </FormLabel>
                                <FormDescription className="text-xs text-muted-foreground">
                                    Show instructors who have specific access rights.
                                </FormDescription>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    {Object.values(InstructorPermission).map((permission) => {
                                        const formatted = permission.replaceAll("_", " ").toLowerCase();
                                        const isChecked = (field.value ?? []).includes(permission);

                                        return (
                                            <FormItem
                                                key={permission}
                                                className={cn(
                                                    "flex items-center space-x-3 rounded-lg border p-3 transition-all cursor-pointer",
                                                    isChecked
                                                        ? "bg-primary/5 border-primary/50 shadow-sm"
                                                        : "bg-card hover:bg-accent/50 hover:border-accent"
                                                )}
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={isChecked}
                                                        className="data-[state=checked]:bg-primary"
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(
                                                                checked
                                                                    ? [...(field.value ?? []), permission]
                                                                    : (field.value ?? []).filter((v) => v !== permission)
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <Label className="capitalize text-sm font-medium cursor-pointer flex-1">
                                                    {formatted}
                                                </Label>
                                            </FormItem>
                                        );
                                    })}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Share Percentage Range */}
                {shareRange && (
                    <FormField
                        control={form.control}
                        name="shareRange"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                        <PieChart className="w-4 h-4" />
                                        Share Percentage
                                    </FormLabel>
                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                        {field.value ? field.value[0] : 0}% - {field.value ? field.value[1] : 0}%
                                    </span>
                                </div>
                                <FormControl>
                                    <div className="px-2">
                                        <DualSlider
                                            disabled={false}
                                            max={100}
                                            step={1}
                                            values={[field.value[0], field.value[1]]}
                                            onChange={(values) => {
                                                form.setValue("shareRange", values);
                                            }}
                                        />
                                    </div>
                                </FormControl>
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