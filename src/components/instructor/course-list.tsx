'use client';

import { api } from '@/trpc/react';
import { useEffect, useState } from "react";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useInView } from "react-intersection-observer";
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, BookOpen, LayoutGrid, SearchX } from "lucide-react";
import { FilterInstructorCoursesWithOptionalCourseIdSchema } from '@/lib/schema/instructor';
import { InstructorCourseFilter } from '@/components/filters/instructor-course-filter';
import { CourseCard } from '@/components/instructor/course-card';
import { toast } from 'sonner';

export function CourseList() {
    const [filters, setFilters] = useState<FilterInstructorCoursesWithOptionalCourseIdSchema>({
        courseId: undefined,
        search: "",
        permissions: [],
        status: "ALL",
        shareRange: [0, 100],
    });

    const limit = 12;
    const { ref, inView } = useInView();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading } = 
        api.teacher.instructor.getMyCoursesAsInstructorWithInfiniteScroll.useInfiniteQuery(
            {
                ...filters,
                courseId: filters.courseId?.trim() === "" ? undefined : filters.courseId,
                search: filters.search?.trim() === "" ? undefined : filters.search,
                limit
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
                initialCursor: undefined,
            }
        );

    const acceptRequestMutation = api.teacher.instructor.acceptRequest.useMutation();
    const rejectRequestMutation = api.teacher.instructor.rejectRequest.useMutation();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    const users = data?.pages.flatMap((p) => p.instructors) ?? [];
    const hasActiveFilters = !!(filters.search || filters.courseId || filters.status !== "ALL" || filters.permissions.length > 0);

    const onAccept = async (requestId: string) => {
        toast.promise(
            acceptRequestMutation.mutateAsync(requestId, {
                onSuccess: () => refetch()
            }),
            {
                loading: "Accepting course invitation...",
                success: "Invitation accepted!",
                error: (err) => `Failed to accept: ${err.message}`,
            }
        );
    };

    const onReject = async (requestId: string) => {
        toast.promise(
            rejectRequestMutation.mutateAsync(requestId, {
                onSuccess: () => refetch()
            }),
            {
                loading: "Rejecting course invitation...",
                success: "Invitation declined.",
                error: (err) => `Failed to reject: ${err.message}`,
            }
        );
    };

    return (
        <div className="w-full h-full flex flex-col gap-6">
            
            {/* Header & Filter Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Assigned Courses</h2>
                        <p className="text-sm text-muted-foreground">Manage invitations and courses you instruct.</p>
                    </div>
                </div>

                <InstructorCourseFilter
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
                    show={{ courseId: true, search: true, permissions: true, status: true, shareRange: true }}
                />
            </div>

            {/* List Content Area */}
            <div className="w-full flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {!isLoading && users.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-3xl bg-muted/5 animate-in fade-in zoom-in duration-300">
                        <div className="bg-background p-6 rounded-full shadow-xl mb-6">
                            {hasActiveFilters ? (
                                <SearchX className="w-12 h-12 text-muted-foreground/60" />
                            ) : (
                                <LayoutGrid className="w-12 h-12 text-muted-foreground/40" />
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                            {hasActiveFilters ? "No courses match filters" : "No courses assigned yet"}
                        </h3>
                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto px-4">
                            {hasActiveFilters 
                                ? "Adjust your search or change the filters to find specific course assignments." 
                                : "When you are invited to instruct a course, it will appear here for your review."}
                        </p>
                        {hasActiveFilters && (
                            <Button 
                                variant="link" 
                                className="mt-4 font-semibold text-primary"
                                onClick={() => setFilters({ courseId: undefined, search: "", permissions: [], status: "ALL", shareRange: [0, 100] })}
                            >
                                Reset all filters
                            </Button>
                        )}
                    </div>
                ) : (
                    /* The Course Feed */
                    <div className="grid grid-cols-1 gap-4 pb-12">
                        {users.map((user) => (
                            <CourseCard 
                                key={user.id} 
                                request={user} 
                                onAccept={onAccept} 
                                onReject={onReject} 
                            />
                        ))}
                    </div>
                )}

                {/* Infinite Scroll & Loader */}
                <div ref={ref} className="flex flex-col items-center py-10">
                    {isFetchingNextPage ? (
                        <div className="flex items-center gap-3 bg-background border px-4 py-2 rounded-full shadow-sm text-sm font-medium text-muted-foreground animate-pulse">
                            <Spinner /> Loading more assignments...
                        </div>
                    ) : (!hasNextPage && users.length > 0) ? (
                        <div className="flex items-center gap-4 w-full px-10">
                            <div className="h-px bg-linear-to-r from-transparent via-border to-transparent flex-1" />
                            <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
                                Catalogue End
                            </span>
                            <div className="h-px bg-linear-to-r from-transparent via-border to-transparent flex-1" />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}