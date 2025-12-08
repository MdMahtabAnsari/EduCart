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
} from "@/components/ui/select"

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
                {permissions && (<FormField
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="text-base font-semibold text-foreground">
                                Permissions
                            </FormLabel>
                            <FormDescription className="text-sm text-muted-foreground">
                                Select the permissions you want to grant this instructor.
                            </FormDescription>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                {Object.values(InstructorPermission).map((permission) => {
                                    const formatted = permission.replaceAll("_", " ").toLowerCase();
                                    const isChecked = (field.value ?? []).includes(permission);

                                    return (
                                        <FormItem
                                            key={permission}
                                            className={cn(
                                                "flex items-center space-x-3 rounded-md border p-3 transition-all",
                                                isChecked
                                                    ? "bg-accent/10 border-accent"
                                                    : "hover:bg-muted/40"
                                            )}
                                        >
                                            <FormControl>
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(
                                                            checked
                                                                ? [...(field.value ?? []), permission]
                                                                : (field.value ?? []).filter((v) => v !== permission)
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <Label className="capitalize text-sm font-medium">
                                                {formatted}
                                            </Label>
                                        </FormItem>
                                    );
                                })}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />)}
                {status && (<FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            {Object.values(InstructorStatus).map((statusOption) => (
                                                statusOption !== "REMOVED" && (
                                                    <SelectItem key={statusOption} value={statusOption}>
                                                        {statusOption.replaceAll("_", " ")}
                                                    </SelectItem>
                                                )
                                            ))}
                                            <SelectItem key="ALL" value="ALL">
                                                All
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>Filter by status</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />)}
                {shareRange && (<FormField
                    control={form.control}
                    name="shareRange"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price Range</FormLabel>
                            <FormControl>
                                <DualSlider
                                    disabled={false}
                                    max={100}
                                    step={1}
                                    values={[field.value[0], field.value[1]]}
                                    onChange={(values) => {
                                        form.setValue("shareRange", values);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Filter instructors by share percentage range
                            </FormDescription>
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

