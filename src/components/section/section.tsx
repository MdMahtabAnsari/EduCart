"use client";
import { SectionRouterOutputs } from "@/server/api/routers/teacher/section";
import { SectionList } from "@/components/section/section-list";
import { useRouter } from "next/navigation";
import {api} from "@/trpc/react";
import { toast } from "sonner";

interface SectionProps {
    sections: SectionRouterOutputs["getSectionsByCourseId"];
    className?: string;
    role: string;
}


export function Section({ sections, className, role }: SectionProps) {
    const router = useRouter();
    const deleteSection = api.teacher.section.deleteSection.useMutation();
    const onDelete = (sectionId: string) => {
        toast.promise(
            deleteSection.mutateAsync(sectionId, {
                onSuccess: () => {
                    router.refresh();
                },
            }),
            {
                loading: "Deleting section...",
                success: "Section deleted successfully",
                error: (err) => `Error: ${err.message}`,
            }
        );
    }
    return (
        <div className={`w-4/6 ${className}`}>
        <SectionList sections={sections} role={role} onRefresh={() => router.refresh()} onDelete={onDelete} onSubmission={() => router.refresh()} />
        </div>
    );
}