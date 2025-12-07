"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
    filteredCoursesSchema,
    type FilteredCoursesSchema,
} from "@/lib/schema/course";
import { Button } from "@/components/ui/button";
import { TagSelector } from "@/components/selectors/tag-selector";
import { CategorySelector } from "@/components/selectors/category-selector";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
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
import { CourseLevel } from "@/generated/prisma/enums";
import { LanguageSelector } from "@/components/selectors/language-selector";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { TeacherSelector } from "@/components/selectors/teacher-selector";
import { DualSlider } from "@/components/sliders/dual-slider";

export interface ShowFields {
    showSearch: boolean;
    showCategories: boolean;
    showTags: boolean;
    showLanguages: boolean;
    showInstructors: boolean;
    showPriceRange: boolean;
    showFreePaid: boolean;
    showLevel: boolean;
    showRatings: boolean;
}

export interface CourseFilterFormProps {
    onSubmit: (values: FilteredCoursesSchema) => void;
    defaultValues: FilteredCoursesSchema;
    showFields: ShowFields;

}

export function CourseFilterForm({
    onSubmit, defaultValues, showFields,
}: CourseFilterFormProps) {
    const form = useForm<FilteredCoursesSchema>({
        resolver: zodResolver(filteredCoursesSchema),
        defaultValues,
    });

    const freeValue = useWatch({
        control: form.control,
        name: "free",
    });


    useEffect(() => {
        if (freeValue === "FREE") {
            form.setValue("priceRange", [0, 0]);
        }
    }, [freeValue, form]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 p-4"
            >
                {/* Search Input */}
                {showFields.showSearch && (
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Search</FormLabel>
                                <FormControl>
                                    <Input placeholder="Search courses..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <Separator />

                {/* Category Selector */}
                {showFields.showCategories && (
                    <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categories</FormLabel>
                                <FormControl>
                                    <CategorySelector selected={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Tag Selector */}
                {showFields.showTags && (
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <TagSelector selected={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Language Selector */}
                {showFields.showLanguages && (
                    <FormField
                        control={form.control}
                        name="languages"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Languages</FormLabel>
                                <FormControl>
                                    <LanguageSelector selected={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Instructor Selector */}
                {showFields.showInstructors && (
                    <FormField
                        control={form.control}
                        name="instructors"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instructors</FormLabel>
                                <FormControl>
                                    <TeacherSelector selected={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <Separator />

                {/* Price Range */}
                {showFields.showPriceRange && (
                    <FormField
                        control={form.control}
                        name="priceRange"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price Range</FormLabel>
                                <FormControl>
                                    <DualSlider
                                        disabled={freeValue === "FREE"}
                                        max={10000}
                                        step={10}
                                        values={[field.value[0], field.value[1]]}
                                        onChange={(values) => {
                                            form.setValue("priceRange", values);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Range: ₹{field.value ? field.value[0] : 0} - ₹{field.value ? field.value[1] : 0}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                )}

                {/* Free / Paid Toggle */}
                {showFields.showFreePaid && (
                    <FormField
                        control={form.control}
                        name="free"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Courses" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Price Type</SelectLabel>
                                            <SelectItem value="ALL">All</SelectItem>
                                            <SelectItem value="FREE">Free</SelectItem>
                                            <SelectItem value="PAID">Paid</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Level Selector */}
                {showFields.showLevel && (
                    <FormField
                        control={form.control}
                        name="level"
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
                                            <SelectLabel>Level</SelectLabel>
                                            <SelectItem value="ALL">All</SelectItem>
                                            {Object.values(CourseLevel).map((lvl) => (
                                                <SelectItem key={lvl} value={lvl}>
                                                    {lvl}
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

                <Separator />
                {/* Ratings Selector */}
                {showFields.showRatings && (
                    <FormField
                        control={form.control}
                        name="ratings"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ratings</FormLabel>
                                <Rating {...field} onValueChange={field.onChange} >
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <RatingButton className={index < field.value ? "text-green-500" : "text-muted-foreground"} key={index} />
                                ))}
                            </Rating>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <Separator />

                <Button type="submit" className="w-full cursor-pointer">
                    Apply Filters
                </Button>
            </form>
        </Form>
    );
}
