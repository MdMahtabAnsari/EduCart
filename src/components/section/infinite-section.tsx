"use client";

import { api } from "@/trpc/react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { CreateSectionDialog } from "@/components/dialog/section/create-section-dialog";
import { Plus, RotateCcw, Layers, FolderPlus } from "lucide-react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { cn } from "@/lib/utils";

interface InfiniteSectionProps {
    courseId: string;
    role: string;
}

export function InfiniteSection({ courseId, role }: InfiniteSectionProps) {
    const { ref, inView } = useInView();
    const limit = 18;
    
    const queryArgs = { courseId, limit };
    const queryOptions = {
        getNextPageParam: (lastPage: { nextCursor?: string }) => lastPage.nextCursor,
        initialCursor: undefined,
    };

    // Safely initialize all queries (React rule of hooks), then select the correct data
    const teacherQuery = api.teacher.section.sectionWithInfiniteScroll.useInfiniteQuery;
    const userQuery = api.user.section.sectionWithInfiniteScroll.useInfiniteQuery;
    const adminQuery = api.admin.section.sectionWithInfiniteScroll.useInfiniteQuery;

    const activeQuery = role === "teacher" ? teacherQuery(queryArgs, queryOptions) : role === "user" ? userQuery(queryArgs, queryOptions) : adminQuery(queryArgs, queryOptions);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading, isRefetching } = activeQuery;

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    // Flatten all loaded pages safely
    const flattenPages = data?.pages.flatMap((p) => p) ?? [];
    const sections = flattenPages.flatMap((page) => page.sections);
    const permissions = flattenPages.length > 0 
        ? flattenPages[0].permissions 
        : { canCreate: false, canUpdate: false, canDelete: false };

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-500">
            
            {/* Header & Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Layers className="w-5 h-5 text-primary" />
                        </div>
                        Curriculum
                    </h2>
                    <p className="text-sm text-muted-foreground ml-11">
                        Manage the sections, modules, and structure of this course.
                    </p>
                </div>

                <div className="flex items-center gap-2 ml-11 sm:ml-0 w-full sm:w-auto">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="shrink-0 shadow-sm hover:bg-muted" 
                        onClick={() => refetch()}
                        disabled={isRefetching}
                    >
                        <RotateCcw className={cn("w-4 h-4 text-muted-foreground", isRefetching && "animate-spin text-primary")} />
                    </Button>

                    {permissions.canCreate && (
                        <CreateSectionDialog 
                            courseId={courseId} 
                            onSubmission={refetch}
                            trigger={
                                <Button className="w-full sm:w-auto shadow-md shadow-primary/10 cursor-pointer">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Section
                                </Button>
                            } 
                        />
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner className="text-primary/60 w-8 h-8" />
                    </div>
                ) : sections.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed rounded-3xl bg-muted/5">
                        <div className="bg-background p-5 rounded-full shadow-sm mb-4 ring-1 ring-border/50">
                            <FolderPlus className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No sections created</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">
                            This course doesn&apos;t have any curriculum sections yet. Click &quot;New Section&quot; to start building your course structure.
                        </p>
                    </div>
                ) : (
                    /* Hover Cards Feed */
                    <div className="pb-6">
                        <HoverEffect
                            items={sections.map((section) => ({
                                title: section.title,
                                description: "Click to view and manage lessons inside this section.", // Replaced the empty string with helpful context
                                link: `/${role}/courses/${section.courseId}/sections/${section.id}/lessons`,
                                id: section.id
                            }))}
                        />
                    </div>
                )}

                {/* Infinite Scroll Sentinel */}
                <div ref={ref} className="flex justify-center py-8">
                    {isFetchingNextPage ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                            <Spinner className="w-4 h-4" /> Loading more sections...
                        </div>
                    ) : (!hasNextPage && sections.length > 0) ? (
                        <div className="flex items-center gap-4 w-full px-10">
                            <div className="h-px bg-border/60 flex-1" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">
                                End of Curriculum
                            </span>
                            <div className="h-px bg-border/60 flex-1" />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}