'use client';
import { api } from '@/trpc/react';
import { useEffect, useState } from "react";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useInView } from "react-intersection-observer";
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from "lucide-react";
import {FilterInstructorCoursesWithOptionalCourseIdSchema } from '@/lib/schema/instructor';
import { InstructorCourseFilter } from '@/components/filters/instructor-course-filter';
import { CourseCard } from '@/components/instructor/course-card';
import { toast } from 'sonner';



export function CourseList() {
    const [filters, setFilters] = useState<FilterInstructorCoursesWithOptionalCourseIdSchema>({
        courseId:undefined,
        search: "",
        permissions: [],
        status: "ALL",
        shareRange: [0, 100],
    });
    const limit = 12;
    const { ref, inView } = useInView();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = api.teacher.instructor.getMyCoursesAsInstructorWithInfiniteScroll.useInfiniteQuery(
        {   ...filters,
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
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);
    const users = data?.pages.flatMap((p) => p.instructors) ?? [];

    const onAccept = async (requestId: string) => {
        toast.promise(
            acceptRequestMutation.mutateAsync(requestId, {
                onSuccess: () => {
                    refetch();
                }
            })
            ,
            {
                loading: "Accepting request...",
                success: "Request accepted",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    const onReject = async (requestId: string) => {
        toast.promise(
            rejectRequestMutation.mutateAsync(requestId, {
                onSuccess: () => {
                    refetch();
                }
            })
            ,
            {
                loading: "Rejecting request...",
                success: "Request rejected",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex items-center justify-start gap-2">
                <InstructorCourseFilter
                    trigger={<Button className="cursor-pointer w-fit" size="lg"><SlidersHorizontal /> Filter</Button>}
                    onSubmit={(values) => {
                        setFilters(values);
                    }}
                    defaultValues={filters}
                    show={{ courseId: true, search: true, permissions: true, status: true, shareRange: true }}
                />
            </div>

            <div className="w-full h-[calc(100vh-200px)] overflow-scroll scrollbar-hide">
                <div className="flex flex-col gap-4">
                    {users.map((user) => (
                        <CourseCard key={user.id} request={user} onAccept={onAccept} onReject={onReject} />
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