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
import { useEffect } from "react";
import { TeacherSelector } from "@/components/selectors/teacher-selector";
import { DualSlider } from "@/components/sliders/dual-slider";

// Added icons to make the filter categories easily scannable
import { 
    Search, 
    Grid2X2, 
    Tags as TagsIcon, 
    Globe, 
    Users, 
    IndianRupee, 
    BarChart, 
    Star, 
    Filter 
} from "lucide-react";

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
                className="flex flex-col gap-8 pb-8"
            >
                {/* Search Input */}
                {showFields.showSearch && (
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <Search className="w-4 h-4" />
                                    Search
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
                                        <Input 
                                            placeholder="Keywords, titles, topics..." 
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

                {/* Category Selector */}
                {showFields.showCategories && (
                    <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <Grid2X2 className="w-4 h-4" />
                                    Categories
                                </FormLabel>
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
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <TagsIcon className="w-4 h-4" />
                                    Tags
                                </FormLabel>
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
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <Globe className="w-4 h-4" />
                                    Language
                                </FormLabel>
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
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <Users className="w-4 h-4" />
                                    Instructors
                                </FormLabel>
                                <FormControl>
                                    <TeacherSelector selected={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
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
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <IndianRupee className="w-4 h-4" />
                                    Price Type
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="bg-muted/20">
                                            <SelectValue placeholder="All Courses" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Select Type</SelectLabel>
                                            <SelectItem value="ALL">All Prices</SelectItem>
                                            <SelectItem value="FREE">Free Only</SelectItem>
                                            <SelectItem value="PAID">Paid Only</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Price Range (Fades out seamlessly if 'Free Only' is selected) */}
                {showFields.showPriceRange && (
                    <div className={`transition-all duration-300 ${freeValue === "FREE" ? "opacity-40 grayscale pointer-events-none" : ""}`}>
                        <FormField
                            control={form.control}
                            name="priceRange"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                            <IndianRupee className="w-4 h-4" />
                                            Price Range
                                        </FormLabel>
                                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                            ₹{field.value ? field.value[0] : 0} - ₹{field.value ? field.value[1] : 0}
                                        </span>
                                    </div>
                                    <FormControl>
                                        <div className="px-2">
                                            <DualSlider
                                                disabled={freeValue === "FREE"}
                                                max={10000}
                                                step={10}
                                                values={[field.value[0], field.value[1]]}
                                                onChange={(values) => {
                                                    form.setValue("priceRange", values);
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                {/* Level Selector */}
                {showFields.showLevel && (
                    <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <BarChart className="w-4 h-4" />
                                    Course Level
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="bg-muted/20">
                                            <SelectValue placeholder="All Levels" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Difficulty</SelectLabel>
                                            <SelectItem value="ALL">All Levels</SelectItem>
                                            {Object.values(CourseLevel).map((lvl) => (
                                                <SelectItem key={lvl} value={lvl}>
                                                    {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
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

                {/* Ratings Selector */}
                {showFields.showRatings && (
                    <FormField
                        control={form.control}
                        name="ratings"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                                    <Star className="w-4 h-4" />
                                    Minimum Rating
                                </FormLabel>
                                <div className="flex items-center gap-3">
                                    <Rating {...field} onValueChange={field.onChange} className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <RatingButton 
                                                key={index}
                                                className={`w-6 h-6 transition-colors ${
                                                    index < field.value 
                                                        ? "text-amber-500 fill-amber-500" 
                                                        : "text-muted-foreground/30 hover:text-amber-500/50 hover:fill-amber-500/20"
                                                }`} 
                                            />
                                        ))}
                                    </Rating>
                                    {field.value > 0 && (
                                        <span className="text-xs font-medium text-muted-foreground">
                                            &amp; Up
                                        </span>
                                    )}
                                </div>
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