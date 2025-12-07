'use client';
import { EnrollmentUserCard } from "@/components/enrollment/enrollment-user-card";
import { EnrollmentFilter } from "@/components/filters/enrollment-filter";
import { type FilteredEnrollmentsSchema, type FiteredEnrollmentSchmeaWithOptionalCourseId } from "@/lib/schema/enrollment";
import { api } from '@/trpc/react';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { SlidersHorizontal } from 'lucide-react';
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

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = api.teacher.enrollment.enrollmentByCourseIdWithInfiniteScroll.useInfiniteQuery(
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
    const onFilterSubmit = (values: FiteredEnrollmentSchmeaWithOptionalCourseId) => {
        setFilters({
            courseId: courseId,
            search: values.search || "",
            status: values.status,
        });
    }
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
                onSubmit={onFilterSubmit}
                defaultValues={filters}
                show={{ courseId: false, search: true, status: true }}
            />

            <div className="w-full h-[calc(100vh-200px)] overflow-scroll scrollbar-hide">
                <div className="flex flex-col gap-4">
                    {users.map((user) => (
                        <EnrollmentUserCard key={user.id} enrollment={user} />
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