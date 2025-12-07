"use client";
import { api } from "@/trpc/react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { CreateSectionDialog } from "@/components/dialog/section/create-section-dialog";
import { Plus, RotateCcw } from "lucide-react";
import { HoverEffect } from "@/components/ui/card-hover-effect";

interface InfiniteSectionProps {
    courseId: string;
    role: string;
}

export function InfiniteSection({ courseId, role }: InfiniteSectionProps) {
    const { ref, inView } = useInView();
    const limit = 18;
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = role === "teacher" ? api.teacher.section.sectionWithInfiniteScroll.useInfiniteQuery(
            {
                courseId,
                limit,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
                initialCursor: undefined,
            }
        ): api.user.section.sectionWithInfiniteScroll.useInfiniteQuery(
            {
                courseId,
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
    const flattenPages = data?.pages.flatMap((p) => p) ?? [];
    const sections = flattenPages.flatMap((page) => page.sections);
    const permissions = flattenPages.length > 0 ? flattenPages[0].permissions : { canCreate: false, canUpdate: false, canDelete: false };

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex justify-end items-center gap-2">
                {permissions.canCreate && (
                    <CreateSectionDialog courseId={courseId} onSubmission={refetch}
                        trigger={
                            <Button className="cursor-pointer" size="sm">

                                <Plus />
                                Create Section
                            </Button>
                        } />
                )}
                <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => refetch()}>
                    <RotateCcw />
                </Button>
            </div>
            <div className="w-full h-[calc(100vh-200px)] overflow-scroll scrollbar-hide">
                <HoverEffect
                    items={sections.map((section) => ({
                        title: section.title,
                        description: ``,
                        link: `/${role}/courses/${section.courseId}/sections/${section.id}/lessons`,
                    }))}
                />
                <div ref={ref} className="flex justify-center my-4"
                >
                    {isFetchingNextPage ? (
                        <Spinner />
                    ) : !hasNextPage ? (
                        <div className="text-muted-foreground">No more sections to load</div>
                    ) : undefined}
                </div>

            </div>

        </div>
    );
}