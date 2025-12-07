'use client';
import { EnrollmentFilter } from "@/components/filters/enrollment-filter";
import { type FiteredEnrollmentSchmeaWithOptionalCourseId } from "@/lib/schema/enrollment";
import { api } from '@/trpc/react';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { SlidersHorizontal } from 'lucide-react';
import { StudentUserCard } from "@/components/enrollment/student-user-card";
import { useInView } from "react-intersection-observer";


export function StudentList() {
    const [filters, setFilters] = useState<FiteredEnrollmentSchmeaWithOptionalCourseId>({
        courseId: undefined,
        search: "",
        status: "ALL",
    });
    const limit = 12;
    const { ref, inView } = useInView();


    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = api.teacher.enrollment.uniqueStudentsInfiniteScroll.useInfiniteQuery(
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
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);
    const users = data?.pages.flatMap((p) => p.enrollments) ?? [];

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <EnrollmentFilter
                trigger={<Button className="cursor-pointer w-fit" size="lg"><SlidersHorizontal /> Filter</Button>}
                onSubmit={(values) => {
                    setFilters(values);
                }}
                defaultValues={filters}
                show={{ courseId: true, search: true, status: true }}
            />

            <div className="w-full h-[calc(100vh-200px)] overflow-scroll scrollbar-hide">
                <div className="flex flex-col gap-4">
                    {users.map((user) => (
                        <StudentUserCard key={user.id} enrollment={user} />
                    ))}
                </div>
                <div ref={ref} className="flex justify-center my-4"
                >
                    {isFetchingNextPage ? (
                        <Spinner />
                    ) : !hasNextPage ? (
                        <div className="text-muted-foreground">No more students to load</div>
                    ) : undefined}
                </div>
            </div>
        </div>
    );
}