import { SectionCard } from "@/components/section/section-card";
import { SectionRouterOutputs } from "@/server/api/routers/teacher/section";
import { FolderOpen } from "lucide-react";

export interface SectionCardListProps {
    sections: SectionRouterOutputs["sectionWithInfiniteScroll"]["sections"];
}

export const SectionCardList = ({ sections }: SectionCardListProps) => {
    
    // Graceful Empty State
    if (!sections || sections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed rounded-3xl bg-muted/5 animate-in fade-in duration-500">
                <div className="bg-background p-5 rounded-full shadow-sm mb-4 ring-1 ring-border/50">
                    <FolderOpen className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-bold text-foreground tracking-tight">
                    No sections found
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                    There are currently no sections available in this view.
                </p>
            </div>
        );
    }

    // Responsive Grid Layout
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {sections.map(section => (
                <SectionCard key={section.id} section={section} />
            ))}
        </div>
    );
};