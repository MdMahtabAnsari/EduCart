"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";
import { api } from '@/trpc/react';
import { SectionList } from "@/components/section/section-list";
import { Error } from "@/components/error/error";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { toast } from "sonner";
import { BookOpen, ListTree } from "lucide-react";

interface SectionSheetProps {
    trigger: ReactNode;
    courseId: string;
    role: string;
}

export function SectionSheet({ trigger, courseId, role }: SectionSheetProps) {
    // 1. Safely initialize hooks unconditionally
    const teacherQuery = api.teacher.section.getSectionsByCourseId.useQuery(courseId, { 
        enabled: role === 'teacher' 
    });
    const userQuery = api.user.section.getSectionsByCourseId.useQuery(courseId, { 
        enabled: role === 'user' 
    });

    // 2. Determine which query results to use based on the role
    const activeQuery = role === 'teacher' ? teacherQuery : userQuery;
    const { data, isPending, error, refetch } = activeQuery;

    const deleteSection = api.teacher.section.deleteSection.useMutation();

    const onDelete = (sectionId: string) => {
        toast.promise(
            deleteSection.mutateAsync(sectionId, {
                onSuccess: () => refetch(),
            }),
            {
                loading: "Removing section...",
                success: "Section removed successfully",
                error: (err) => `Error: ${err.message}`,
            }
        );
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col h-full border-l-border/50 shadow-2xl">
                
                {/* Fixed Premium Header */}
                <div className="px-6 py-6 border-b border-border/50 bg-primary/5 shrink-0">
                    <SheetHeader className="text-left">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <ListTree className="w-5 h-5" />
                            </div>
                            <SheetTitle className="text-xl font-bold tracking-tight">
                                Course Curriculum
                            </SheetTitle>
                        </div>
                        <SheetDescription className="text-sm">
                            Browse and navigate through the modules and lessons of this course.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {isPending ? (
                        <div className="flex flex-col justify-center items-center h-full min-h-75 gap-3 text-muted-foreground animate-pulse">
                            <Spinner className="w-8 h-8 text-primary/60" />
                            <span className="text-sm font-medium">Loading curriculum...</span>
                        </div>
                    ) : error ? (
                        <div className="pt-10">
                            <Error 
                                title="Failed to load curriculum" 
                                description={error.message} 
                                onRetry={refetch} 
                            />
                        </div>
                    ) : data ? (
                        <SectionList 
                            sections={data} 
                            role={role} 
                            onRefresh={refetch} 
                            onDelete={onDelete} 
                            onSubmission={refetch} 
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
                            <BookOpen className="w-12 h-12 mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">No data available</h3>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}