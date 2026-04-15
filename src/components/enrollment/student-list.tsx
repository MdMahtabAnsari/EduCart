'use client';

import { EnrollmentFilter } from "@/components/filters/enrollment-filter";
import { type FilteredEnrollmentSchemaWithOptionalCourseId } from "@/lib/schema/enrollment";
import { api } from '@/trpc/react';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { SlidersHorizontal, Users, SearchX, UserCheck } from 'lucide-react';
import { StudentUserCard } from "@/components/enrollment/student-user-card";
import { useInView } from "react-intersection-observer";

export function StudentList() {
    const [filters, setFilters] = useState<FilteredEnrollmentSchemaWithOptionalCourseId>({
        courseId: undefined,
        search: "",
        status: "ALL",
    });
    
    const limit = 12;
    const { ref, inView } = useInView();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = 
        api.teacher.enrollment.uniqueStudentsInfiniteScroll.useInfiniteQuery(
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

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    const users = data?.pages.flatMap((p) => p.enrollments) ?? [];
    const hasActiveFilters = !!(filters.search || filters.courseId || filters.status !== "ALL");

    return (
        <div className="w-full h-full flex flex-col gap-6">
            
            {/* Page Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/60">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Student Directory</h2>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                        Viewing all unique students enrolled across your courses.
                    </p>
                </div>

                <div className="flex items-center gap-3 ml-11 md:ml-0">
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
                        onSubmit={(values) => setFilters(values)}
                        defaultValues={filters}
                        show={{ courseId: true, search: true, status: true }}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Empty / Loading States */}
                {!isLoading && users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-2xl bg-muted/5">
                        <div className="bg-background p-5 rounded-full shadow-sm mb-4">
                            {hasActiveFilters ? (
                                <SearchX className="w-10 h-10 text-muted-foreground/60" />
                            ) : (
                                <UserCheck className="w-10 h-10 text-muted-foreground/60" />
                            )}
                        </div>
                        <h3 className="text-xl font-semibold">
                            {hasActiveFilters ? "No students match these filters" : "No students found"}
                        </h3>
                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                            {hasActiveFilters 
                                ? "Try broadening your search or changing the course filter to find the students you're looking for." 
                                : "Once students enroll in any of your courses, they will appear in this directory."}
                        </p>
                        {hasActiveFilters && (
                            <Button 
                                variant="outline" 
                                className="mt-6"
                                onClick={() => setFilters({ courseId: undefined, search: "", status: "ALL" })}
                            >
                                Reset Directory
                            </Button>
                        )}
                    </div>
                ) : (
                    /* The Feed */
                    <div className="grid grid-cols-1 gap-4 pb-10">
                        {users.map((user) => (
                            <StudentUserCard key={user.id} enrollment={user} />
                        ))}
                    </div>
                )}

                {/* Loading / Infinite Scroll Sentinel */}
                <div ref={ref} className="flex flex-col items-center justify-center py-10 border-t border-transparent">
                    {isFetchingNextPage ? (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground animate-pulse">
                            <Spinner /> Loading more students...
                        </div>
                    ) : (!hasNextPage && users.length > 0) ? (
                        <div className="flex items-center gap-4 w-full">
                            <div className="h-px bg-border/60 flex-1" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                                End of Directory
                            </span>
                            <div className="h-px bg-border/60 flex-1" />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}