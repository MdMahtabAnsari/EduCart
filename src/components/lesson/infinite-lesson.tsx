"use client";
import { api } from "@/trpc/react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Plus, RotateCcw, } from "lucide-react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import Link from "next/link";
import { CircleCheck } from 'lucide-react';

interface InfiniteLessonProps {
    courseId: string;
    sectionId: string;
    role: string;
}

export function InfiniteLesson({ courseId, sectionId, role }: InfiniteLessonProps) {
    const { ref, inView } = useInView();
    const limit = 18;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = role === "teacher" ? api.teacher.lesson.lessonWithInfiniteScroll.useInfiniteQuery(
        {
            courseId,
            sectionId,
            limit,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            initialCursor: undefined,
        }
    ) : api.user.lesson.lessonWithInfiniteScroll.useInfiniteQuery(
        {
            sectionId,
            limit,
            courseId,
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
    const lessons = flattenPages.flatMap((page) => page.lessons);
    const permissions = flattenPages.length > 0 ? flattenPages[0].permissions : { canCreate: false, canUpdate: false, canDelete: false };
    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex justify-end items-center gap-2">
                {permissions.canCreate && (
                    <Link href={`/${role}/courses/${courseId}/sections/${sectionId}/lessons/create`}>
                        <Button className="cursor-pointer">
                            <Plus />
                            Create Lesson
                        </Button>
                    </Link>
                )}
                <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => refetch()}>
                    <RotateCcw />
                </Button>
            </div>
            <div className="w-full h-[calc(100vh-200px)] overflow-scroll scrollbar-hide">
                <HoverEffect
                    items={lessons.map((lesson) => ({
                        title: lesson.title,
                        description: ``,
                        link: `/${role}/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}`,
                        icon: lesson.progress.length>0 && lesson.progress[0].completed ? <CircleCheck className=" text-green-500" /> : undefined,
                    }))}
                />
                <div ref={ref} className="flex justify-center my-4"
                >
                    {isFetchingNextPage ? (
                        <Spinner />
                    ) : !hasNextPage ? (
                        <div className="text-muted-foreground">No more lessons to load</div>
                    ) : undefined}
                </div>
            </div>
        </div>
    );
}
