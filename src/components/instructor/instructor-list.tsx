'use client';

import { api } from '@/trpc/react';
import { useEffect, useState } from "react";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useInView } from "react-intersection-observer";
import { InstructorUserCard } from '@/components/instructor/instructor-user-card';
import { AddInstructorDialog } from '@/components/dialog/instructor/add-instructor-dialog';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, UserPlus, ShieldCheck, SearchX, Users } from "lucide-react";
import { InstructorFilter } from '@/components/filters/instructor-filter';
import { FilterInstructorCoursesWithOptionalCourseIdSchema } from '@/lib/schema/instructor';

interface InstructorListProps {
    courseId: string;
    role: string;
}

export function InstructorList({ courseId, role }: InstructorListProps) {
    const [filters, setFilters] = useState<FilterInstructorCoursesWithOptionalCourseIdSchema>({
        courseId: courseId,
        search: "",
        permissions: [],
        status: "APPROVED",
        shareRange: [0, 100],
    });

    const limit = 12;
    const { ref, inView } = useInView();

    const queryArgs = {
        ...filters,
        courseId,
        search: filters.search?.trim() === "" ? undefined : filters.search,
        limit,
    };

    // For any non-"user" role (teacher, admin, etc.) use the teacher router
    const useInstructorQuery =
        role === "user"
            ? api.user.instructor.filterCourseInstructorsWithInfiniteScroll.useInfiniteQuery
            : api.teacher.instructor.filterCourseInstructorsWithInfiniteScroll.useInfiniteQuery;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isLoading,
    } = useInstructorQuery(queryArgs, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: undefined,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);



    const users = data?.pages.flatMap((p) => p.instructors) ?? [];
    const permissions = data?.pages[0]?.permissions ?? { canUpdate: false, canDelete: false, canCreate: false };
    const hasActiveFilters = !!(filters.search || filters.permissions.length > 0 || filters.status !== "APPROVED");

    return (
        <div className="w-full h-full flex flex-col gap-6">
            
            {/* Header & Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/60">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        Teaching Team
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Collaborators and instructors assigned to this course.
                    </p>
                </div>

                {role !== "user" && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <InstructorFilter
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
                            show={{ courseId: false, search: true, permissions: true, status: true, shareRange: true }}
                        />
                        
                        {permissions.canCreate && (
                            <AddInstructorDialog 
                                courseId={courseId} 
                                onSuccess={refetch}  
                                trigger={
                                    <Button size="sm" className="shadow-md shadow-primary/10 flex-1 sm:flex-none">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add Member
                                    </Button>
                                } 
                            />
                        )}
                    </div>
                )}
            </div>

            {/* List Section */}
            <div className="w-full flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {!isLoading && users.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl bg-muted/5">
                        <div className="bg-background p-5 rounded-full shadow-sm mb-4">
                            {hasActiveFilters ? (
                                <SearchX className="w-10 h-10 text-muted-foreground/60" />
                            ) : (
                                <Users className="w-10 h-10 text-muted-foreground/60" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                            {hasActiveFilters ? "No matching instructors" : "No team members yet"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                            {hasActiveFilters 
                                ? "Try adjusting your filters or search terms to find team members." 
                                : "Add your first collaborator to start managing this course together."}
                        </p>
                        {hasActiveFilters && (
                            <Button 
                                variant="link" 
                                size="sm"
                                className="mt-2"
                                onClick={() => setFilters({ ...filters, search: "", permissions: [], status: "APPROVED" })}
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    /* Grid/List of Cards */
                    <div className="flex flex-col gap-4 pb-10">
                        {users.map((user) => (
                            <InstructorUserCard 
                                key={user.id} 
                                instructor={user} 
                                permissions={permissions} 
                                onSuccess={refetch} 
                                role={role} 
                            />
                        ))}
                    </div>
                )}

                {/* Infinite Scroll Sentinel */}
                <div ref={ref} className="flex justify-center py-8">
                    {isFetchingNextPage ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Spinner className="text-primary" />
                            <span>Loading more team members...</span>
                        </div>
                    ) : (!hasNextPage && users.length > 0) ? (
                        <div className="flex items-center gap-4 w-full">
                            <div className="h-px bg-border/60 flex-1" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">
                                End of Team List
                            </span>
                            <div className="h-px bg-border/60 flex-1" />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}