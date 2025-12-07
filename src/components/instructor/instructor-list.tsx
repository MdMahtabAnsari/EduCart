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
import { FilterInstructorCoursesSchema } from '@/lib/schema/instructor';

interface InstructorListProps {
    courseId: string
}

export function InstructorList({ courseId }: InstructorListProps) {
    const [filters, setFilters] = useState<FilterInstructorCoursesSchema>({
        courseId: courseId,
        search: "",
    });
    const limit = 12;
    const { ref, inView } = useInView();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = api.teacher.instructor.filterCourseInstructorsWithInfiniteScroll.useInfiniteQuery(
        {
            courseId: filters.courseId,
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
            <div className="flex items-center justify-start gap-2">
                <InstructorFilter
                    trigger={<Button className="cursor-pointer w-fit" size="lg"><SlidersHorizontal /> Filter</Button>}
                    onSubmit={(values) => {
                        setFilters(values);
                    }}
                    defaultValues={filters}
                    show={{ courseId: false, search: true }}
                />
                {permissions.canCreate && <AddInstructorDialog courseId={courseId} onSuccess={refetch}  trigger={<Button className="w-fit cursor-pointer" size="lg"><UserPlus />Add Instructor</Button>} />}
            </div>

            <div className="w-full h-[calc(100vh-200px)] overflow-scroll scrollbar-hide">
                <div className="flex flex-col gap-4">
                    {users.map((user) => (
                        <InstructorUserCard key={user.id} instructor={user} permissions={permissions} onSuccess={refetch} />
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