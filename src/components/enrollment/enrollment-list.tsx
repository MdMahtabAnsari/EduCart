'use client';

import { EnrollmentUserCard } from "@/components/enrollment/enrollment-user-card";
import { EnrollmentFilter } from "@/components/filters/enrollment-filter";
import { type FilteredEnrollmentsSchema, type FilteredEnrollmentSchemaWithOptionalCourseId } from "@/lib/schema/enrollment";
import { api } from '@/trpc/react';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { SlidersHorizontal, Users, SearchX } from 'lucide-react';
import { useInView } from "react-intersection-observer";

interface EnrollmentListProps {
    courseId: string;
}

export function EnrollmentList({ courseId }: EnrollmentListProps) {
    const [filters, setFilters] = useState<FilteredEnrollmentsSchema>({
        courseId: courseId,
        search: "",
        status: "ALL",
    });
    
    const limit = 12;
    const { ref, inView } = useInView();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = 
        api.teacher.enrollment.enrollmentByCourseIdWithInfiniteScroll.useInfiniteQuery(
            {
                ...filters,
                search: filters.search?.trim() === "" ? undefined : filters.search,
                limit
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
                initialCursor: undefined,
            }
        );

    const onFilterSubmit = (values: FilteredEnrollmentSchemaWithOptionalCourseId) => {
        setFilters({
            courseId: courseId,
            search: values.search || "",
            status: values.status,
        });
    };

    // Prevent fetching if already loading or if there are no more pages
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    const users = data?.pages.flatMap((p) => p.enrollments) ?? [];
    
    // Check if we have active filters to change the empty state messaging
    const hasActiveFilters = filters.search !== "" || filters.status !== "ALL";

    return (
        <div className="w-full h-full flex flex-col gap-6">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/60">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        Students
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Manage and view enrollments for this course.
                    </p>
                </div>

                <EnrollmentFilter
                    trigger={
                        <Button variant="outline" size="sm" className="relative shadow-sm flex-1 sm:flex-none">
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Filter
                            {hasActiveFilters && (
                                <span className="ml-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
                            )}
                        </Button>
                    }
                    onSubmit={onFilterSubmit}
                    defaultValues={filters}
                    show={{ courseId: false, search: true, status: true }}
                />
            </div>

            {/* List Section */}
            <div className="w-full flex-1 overflow-y-auto pr-2 sm:pr-4 custom-scrollbar">
                
                {/* Empty State */}
                {!isLoading && users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-xl bg-muted/10 border-dashed">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            {hasActiveFilters ? (
                                <SearchX className="w-8 h-8 text-primary" />
                            ) : (
                                <Users className="w-8 h-8 text-primary" />
                            )}
                        </div>
                        <h3 className="text-lg font-medium text-foreground">
                            {hasActiveFilters ? "No students found" : "No enrollments yet"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                            {hasActiveFilters 
                                ? "We couldn't find any students matching your current filters. Try adjusting your search or status." 
                                : "When students enroll in this course, they will appear here."}
                        </p>
                        {hasActiveFilters && (
                            <Button 
                                variant="link" 
                                onClick={() => onFilterSubmit({ status: "ALL", search: "" })}
                                className="mt-4 text-primary"
                            >
                                Clear all filters
                            </Button>
                        )}
                    </div>
                ) : (
                    /* Populated List */
                    <div className="flex flex-col gap-3 pb-6">
                        {users.map((user) => (
                            <EnrollmentUserCard key={user.id} enrollment={user} />
                        ))}
                    </div>
                )}

                {/* Infinite Scroll Loader */}
                <div ref={ref} className="flex justify-center py-6">
                    {isFetchingNextPage ? (
                        <Spinner className="text-primary/60" />
                    ) : (!hasNextPage && users.length > 0) ? (
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            End of results
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}