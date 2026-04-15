'use client';
import { CourseCard } from "@/components/course/course-card";
import { CourseFilter } from "@/components/filters/course-filter";
import { type FilteredCoursesSchema } from "@/lib/schema/course";
import { api } from '@/trpc/react';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { SlidersHorizontal, BookOpen, SearchX } from 'lucide-react';
import { useInView } from "react-intersection-observer";

interface CourseListProps {
    role: string;
    enrolled?: boolean;
}

const DEFAULT_FILTERS: FilteredCoursesSchema = {
    search: "",
    categories: [],
    tags: [],
    instructors: [],
    priceRange: [0, 10000],
    free: "ALL",
    level: "ALL",
    languages: [],
    ratings: 0,
    enrolled: false,
};

export function CourseList({ role, enrolled }: CourseListProps) {
    const [filters, setFilters] = useState<FilteredCoursesSchema>({
        ...DEFAULT_FILTERS,
        enrolled: enrolled ?? false,
    });

    const { ref, inView } = useInView();
    const limit = 18;
    const isUserOrAdmin = role === 'user' || role === 'admin';

    // Data Fetching logic
    const queryParams = {
        ...filters,
        search: filters.search?.trim() === "" ? undefined : filters.search,
        limit,
    };
    const queryOptions = {
        getNextPageParam: (lastPage: { nextCursor?: string }) => lastPage.nextCursor,
        initialCursor: undefined,
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        role === 'teacher'
            ? api.teacher.course.filterCoursesWithInfiniteScroll.useInfiniteQuery(queryParams, queryOptions)
            : role === 'user'
                ? api.user.course.filterCoursesWithInfiniteScroll.useInfiniteQuery(queryParams, queryOptions)
                : api.admin.course.filterCoursesWithInfiniteScroll.useInfiniteQuery(queryParams, queryOptions);

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    // Flatten all loaded pages
    const courses = data?.pages.flatMap((p) => p.courses) ?? [];

    const hasActiveFilters = !!(filters.search || filters.categories.length > 0 || filters.tags.length > 0 || filters.instructors.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 || filters.free !== "ALL" || filters.level !== "ALL" || filters.languages.length > 0 || filters.ratings > 0);

    return (
        <div className="w-full h-full flex flex-col space-y-6">

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-border/50">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-primary" />
                        {enrolled ? "My Enrolled Courses" : "Explore Courses"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isLoading
                            ? "Loading courses..."
                            : `Showing ${courses.length} ${courses.length === 1 ? 'course' : 'courses'}`}
                    </p>
                </div>

                <CourseFilter
                    trigger={
                        <Button variant="outline" size="sm" className="relative shadow-sm flex-1 sm:flex-none">
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Filter
                            {hasActiveFilters && (
                                <span className="ml-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
                            )}
                        </Button>
                    }
                    onSubmit={(values) => setFilters(values)}
                    defaultValues={filters}
                    showFields={{
                        showSearch: true,
                        showCategories: true,
                        showTags: true,
                        showLanguages: true,
                        showInstructors: isUserOrAdmin,
                        showPriceRange: true,
                        showFreePaid: true,
                        showLevel: true,
                        showRatings: true,
                    }}
                />
            </div>

            {/* Scrollable Grid Area */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-10">

                {isLoading ? (
                    <div className="flex items-center justify-center h-10 animate-pulse">
                        <Spinner size="lg" />
                    </div>
                ) : courses.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                            <SearchX className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">No courses found</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            We couldn&apos;t find any courses matching your current filters. Try adjusting your search criteria.
                        </p>
                        <Button
                            variant="secondary"
                            className="rounded-full"
                            onClick={() => setFilters({ ...DEFAULT_FILTERS, enrolled: enrolled ?? false })}
                        >
                            Clear all filters
                        </Button>
                    </div>
                ) : (
                    /* Course Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} role={role} />
                        ))}
                    </div>
                )}

                {/* Infinite Scroll Trigger & Loader */}
                {courses.length > 0 && (
                    <div ref={ref} className="flex justify-center mt-12 mb-8">
                        {isFetchingNextPage ? (
                            <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full text-sm">
                                <Spinner /> Loading more...
                            </div>
                        ) : !hasNextPage ? (
                            <div className="text-muted-foreground text-sm font-medium bg-muted/30 px-4 py-2 rounded-full">
                                You&apos;ve reached the end of the list
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}