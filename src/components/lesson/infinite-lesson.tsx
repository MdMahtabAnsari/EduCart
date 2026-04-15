"use client";

import { api } from "@/trpc/react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Plus, RotateCcw, Pencil, CheckCircle2, PlayCircle, BookOpen, FileVideo } from "lucide-react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import Link from "next/link";
import { EditSectionDialog } from "@/components/dialog/section/edit-section-dialog";
import { cn } from "@/lib/utils";

interface InfiniteLessonProps {
    courseId: string;
    sectionId: string;
    role: string;
}

export function InfiniteLesson({ courseId, sectionId, role }: InfiniteLessonProps) {
    const { ref, inView } = useInView();
    const limit = 18;

    // 1. Safely initialize all infinite queries (React Rule of Hooks)
    const queryArgs = { courseId, sectionId, limit };
    const queryOptions = {
        getNextPageParam: (lastPage: { nextCursor?: string }) => lastPage.nextCursor,
        initialCursor: undefined,
    };


    const teacherQuery = api.teacher.lesson.lessonWithInfiniteScroll.useInfiniteQuery;
    const userQuery = api.user.lesson.lessonWithInfiniteScroll.useInfiniteQuery;
    const adminQuery = api.admin.lesson.lessonWithInfiniteScroll.useInfiniteQuery;

    const activeQuery = role === "teacher" ? teacherQuery(queryArgs, { ...queryOptions, enabled: role === "teacher" }) : role === "user" ? userQuery(queryArgs, { ...queryOptions, enabled: role === "user" }) : adminQuery(queryArgs, { ...queryOptions, enabled: role === "admin" });
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading, isRefetching } = activeQuery;

    // 2. Safely initialize all section details queries
    const teacherSection = api.teacher.section.getSectionById.useQuery(sectionId, { enabled: role === "teacher" });
    const userSection = api.user.section.getSectionById.useQuery(sectionId, { enabled: role === "user" });
    const adminSection = api.admin.section.getSectionById.useQuery(sectionId, { enabled: role !== "teacher" && role !== "user" });

    const activeSection = role === "teacher" ? teacherSection : role === "user" ? userSection : adminSection;
    const { data: sectionData, isPending: isSectionPending, isError: isSectionError } = activeSection;

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    // Flatten all loaded pages safely
    const flattenPages = data?.pages.flatMap((p) => p) ?? [];
    const lessons = flattenPages.flatMap((page) => page.lessons);
    const permissions = flattenPages.length > 0 
        ? flattenPages[0].permissions 
        : { canCreate: false, canUpdate: false, canDelete: false };

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-500">
            
            {/* Contextual Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/60">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {isSectionPending ? (
                                <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
                            ) : sectionData ? (
                                sectionData.section.title
                            ) : (
                                "Section Lessons"
                            )}
                        </h2>
                    </div>
                    <p className="text-sm text-muted-foreground ml-12">
                        {role === "user" ? "Continue your learning journey." : "Manage the lessons within this curriculum module."}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 ml-12 md:ml-0">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="shrink-0 shadow-sm hover:bg-muted cursor-pointer" 
                        onClick={() => refetch()}
                        disabled={isRefetching}
                    >
                        <RotateCcw className={cn("w-4 h-4 text-muted-foreground", isRefetching && "animate-spin text-primary")} />
                    </Button>

                    {permissions.canUpdate && sectionData && !isSectionPending && !isSectionError && (
                        <EditSectionDialog 
                            section={{ id: sectionData.section.id, title: sectionData.section.title }} 
                            onSubmission={() => refetch()}
                            trigger={
                                <Button variant="secondary" className="shadow-sm cursor-pointer">
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit Section
                                </Button>
                            } 
                        />
                    )}

                    {permissions.canCreate && (
                        <Link href={`/${role}/courses/${courseId}/sections/${sectionId}/lessons/create`}>
                            <Button className="shadow-md shadow-primary/10 cursor-pointer">
                                <Plus className="w-4 h-4 mr-2" />
                                New Lesson
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="w-full flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner className="w-8 h-8 text-primary/60" />
                    </div>
                ) : lessons.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed rounded-3xl bg-muted/5">
                        <div className="bg-background p-5 rounded-full shadow-sm mb-4 ring-1 ring-border/50">
                            <FileVideo className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No lessons found</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">
                            {role === "user" 
                                ? "This section doesn't have any published lessons yet."
                                : "Click 'New Lesson' to start adding content to this section."}
                        </p>
                    </div>
                ) : (
                    /* Lesson Grid / Hover Effect */
                    <div className="pb-6">
                        <HoverEffect
                            items={lessons.map((lesson) => {
                                const isCompleted = lesson.progress.length > 0 && lesson.progress[0].completed;
                                return {
                                    title: lesson.title,
                                    description: role === "user" ? "Click to view lesson content" : "Manage lesson content and settings",
                                    link: `/${role}/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}`,
                                    icon: isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                    ) : (
                                        <PlayCircle className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                                    ),
                                };
                            })}
                        />
                    </div>
                )}

                {/* Infinite Scroll Sentinel */}
                <div ref={ref} className="flex justify-center py-8">
                    {isFetchingNextPage ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                            <Spinner className="w-4 h-4" /> Loading more lessons...
                        </div>
                    ) : (!hasNextPage && lessons.length > 0) ? (
                        <div className="flex items-center gap-4 w-full px-10">
                            <div className="h-px bg-border/60 flex-1" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">
                                End of Section
                            </span>
                            <div className="h-px bg-border/60 flex-1" />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}