'use client';
import { api } from '@/trpc/react';
import { useEffect, useState } from "react";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useInView } from "react-intersection-observer";
import { InstructorUserCard } from '@/components/instructor/instructor-user-card';
import { AddInstructorDialog } from '@/components/dialog/instructor/add-instructor-dialog';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, UserPlus } from "lucide-react";
import { InstructorFilter } from '@/components/filters/instructor-filter';
import {FilterInstructorCoursesWithOptionalCourseIdSchema } from '@/lib/schema/instructor';

interface InstructorListProps {
    courseId: string
    role:string
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

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = role==='teacher'? api.teacher.instructor.filterCourseInstructorsWithInfiniteScroll.useInfiniteQuery(
        {   ...filters,
            courseId: courseId,
            search: filters.search?.trim() === "" ? undefined : filters.search,
            limit
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            initialCursor: undefined,
        }
    ): api.user.instructor.filterCourseInstructorsWithInfiniteScroll.useInfiniteQuery(
        {   ...filters,
            courseId: courseId,
            search: filters.search?.trim() === "" ? undefined : filters.search,
            limit
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
    const users = data?.pages.flatMap((p) => p.instructors) ?? [];
    const permissions = data?.pages[0]?.permissions ?? { canUpdate: false, canDelete: false, canCreate: false };

    return (
        <div className="w-full h-full flex flex-col gap-4">
            {role !== "user" &&(
            <div className="flex items-center justify-start gap-2">
                <InstructorFilter
                    trigger={<Button className="cursor-pointer w-fit" size="lg"><SlidersHorizontal /> Filter</Button>}
                    onSubmit={(values) => {
                        setFilters(values);
                    }}
                    defaultValues={filters}
                    show={{ courseId: false, search: true, permissions: true, status: true, shareRange: true }}
                />
                {permissions.canCreate && <AddInstructorDialog courseId={courseId} onSuccess={refetch}  trigger={<Button className="w-fit cursor-pointer" size="lg"><UserPlus />Add Instructor</Button>} />}
            </div>
            )}

            <div className="w-full h-[calc(100vh-200px)] overflow-scroll scrollbar-hide">
                <div className="flex flex-col gap-4">
                    {users.map((user) => (
                        <InstructorUserCard key={user.id} instructor={user} permissions={permissions} onSuccess={refetch} role={role} />
                    ))}
                </div>
                <div ref={ref} className="flex justify-center my-4"
                >
                    {isFetchingNextPage ? (
                        <Spinner />
                    ) : !hasNextPage ? (
                        <div className="text-muted-foreground">No more instructors to load</div>
                    ) : undefined}
                </div>
            </div>
        </div>
    );
}