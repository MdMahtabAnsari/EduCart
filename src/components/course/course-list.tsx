'use client';
import { CourseCard } from "@/components/course/course-card";
import { CourseFilter } from "@/components/filters/course-filter";
import { type FilteredCoursesSchema } from "@/lib/schema/course";
import { api } from '@/trpc/react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { SlidersHorizontal } from 'lucide-react';
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface CourseListProps {
    role: string;
    enrolled?: boolean;
}

export function CourseList({ role, enrolled }: CourseListProps) {
    const [filters, setFilters] = useState<FilteredCoursesSchema>({
        search: "",
        categories: [],
        tags: [],
        instructors: [],
        priceRange: [0, 10000],
        free: "ALL",
        level: "ALL",
        languages: [],
        ratings: 0,
        enrolled: enrolled ?? false,
    });

    const { ref, inView } = useInView();
    const limit = 18;

    const isTeacher = role === 'teacher';

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = role === 'teacher' ? api.teacher.course.filterCoursesWithInfiniteScroll.useInfiniteQuery(
            {
                ...filters,
                search: filters.search?.trim() === "" ? undefined : filters.search,
                limit,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
                initialCursor: undefined,
            }
        ): api.user.course.filterCoursesWithInfiniteScroll.useInfiniteQuery(
            {
                ...filters,
                search: filters.search?.trim() === "" ? undefined : filters.search,
                limit,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
                initialCursor: undefined,
            }
        );
    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);

    // Flatten all loaded pages
    const courses = data?.pages.flatMap((p) => p.courses) ?? [];

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <CourseFilter
                trigger={<Button className="cursor-pointer w-fit" size="lg"><SlidersHorizontal /> Filter</Button>}
                onSubmit={(values) => {
                    setFilters(values);
                }}
                defaultValues={filters}
                showFields={{
                    showSearch: true,
                    showCategories: true,
                    showTags: true,
                    showLanguages: true,
                    showInstructors: !isTeacher,
                    showPriceRange: true,
                    showFreePaid: true,
                    showLevel: true,
                    showRatings: true,
                }}
            />

            {/* Make this div the scroll container */}
            <div className="w-full h-[calc(100vh-200px)] overflow-scroll scrollbar-hide">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 justify-items-center">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} role={role} />
                ))}
            </div>
            <div ref={ref} className="flex justify-center my-4"
            >
                {isFetchingNextPage ? (
                    <Spinner />
                ) : !hasNextPage ? (
                    <div className="text-muted-foreground">No more courses to load</div>
                ) : undefined}
            </div>
            </div>
        </div>
    );
}