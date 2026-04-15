import { Card } from "@/components/ui/card";
import { SectionRouterOutputs } from "@/server/api/routers/teacher/section";
import { Layers, ChevronRight } from "lucide-react";

interface SectionCardProps {
    section: SectionRouterOutputs["sectionWithInfiniteScroll"]["sections"][number];
}

export const SectionCard = ({ section }: SectionCardProps) => {
    return (
        <Card className="group relative overflow-hidden p-4 sm:p-5 border-border/50 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 min-w-0">
                {/* Icon Container */}
                <div className="shrink-0 p-2.5 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                    <Layers className="w-5 h-5" />
                </div>
                
                {/* Text Content */}
                <div className="space-y-0.5 min-w-0">
                    <h3 className="text-base font-bold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
                        {section.title}
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Curriculum Module
                    </p>
                </div>
            </div>

            {/* Action Indicator */}
            <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
            </div>
            
        </Card>
    );
}