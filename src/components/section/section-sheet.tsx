"use client";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ReactNode } from "react";
import { api } from '@/trpc/react';
import { SectionList } from "@/components/section/section-list";
import { Error } from "@/components/error/error";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { toast } from "sonner";

interface SectionSheetProps {
    trigger: ReactNode;
    courseId: string;
    role: string;
}

export function SectionSheet({
    trigger,
    courseId,
    role
}: SectionSheetProps) {
    const { data, isPending, error, refetch } = role==='teacher' ? api.teacher.section.getSectionsByCourseId.useQuery(courseId) : api.user.section.getSectionsByCourseId.useQuery(courseId);
    const deleteSection = api.teacher.section.deleteSection.useMutation();
        const onDelete = (sectionId: string) => {
            toast.promise(
                deleteSection.mutateAsync(sectionId, {
                    onSuccess: () => {
                        refetch();
                    },
                }),
                {
                    loading: "Deleting section...",
                    success: "Section deleted successfully",
                    error: (err) => `Error: ${err.message}`,
                }
            );
        }
    return (<Sheet>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent className=" overflow-scroll scrollbar-hide">
            <SheetHeader>
                <SheetTitle>Sections</SheetTitle>
                <SheetDescription>Browse through the sections of this course.</SheetDescription>
            </SheetHeader>
            {
                isPending ? (
                    <div className="flex justify-center items-center h-40">
                        <Spinner />
                    </div>
                ) : error ? (
                    <Error title="Error loading sections" description={error.message} onRetry={refetch} />
                ) : (
                    <div className="w-full h-fit p-4">
                    <SectionList sections={data} role={role} onRefresh={refetch} onDelete={onDelete} onSubmission={refetch} />
                    </div>
                )
            }
        </SheetContent>
    </Sheet>
    );
}
