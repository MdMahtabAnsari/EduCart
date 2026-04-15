"use client";

import { SectionRouterOutputs } from "@/server/api/routers/teacher/section";
import { SectionList } from "@/components/section/section-list";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
                    // Refresh the server component state to reflect deletion
                    router.refresh();
                },
            }),
            {
                loading: "Removing course module...",
                success: "Module removed successfully",
                error: (err) => `Failed to remove module: ${err.message}`,
            }
        );
    }

    return (
        <div className={cn(
            "w-full max-w-5xl mx-auto transition-all duration-300 animate-in fade-in zoom-in-95", 
            className
        )}>
            <SectionList 
                sections={sections} 
                role={role} 
                onRefresh={() => router.refresh()} 
                onDelete={onDelete} 
                onSubmission={() => router.refresh()} 
            />
        </div>
    );
}