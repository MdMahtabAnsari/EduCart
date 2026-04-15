"use client";

import { SectionRouterOutputs } from "@/server/api/routers/teacher/section";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Item,
    ItemContent,
    ItemHeader,
    ItemTitle,
} from "@/components/ui/item";
import { 
    RotateCcw, 
    Plus, 
    Trash2, 
    CheckCircle2, 
    Circle,
    Layers,
    PlayCircle,
    FolderX
} from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreateSectionDialog } from "@/components/dialog/section/create-section-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SectionListProps {
    sections: SectionRouterOutputs["getSectionsByCourseId"];
    className?: string;
    role: string;
    onRefresh?: () => void;
    onDelete?: (sectionId: string) => void;
    onSubmission?: () => void;
}

export function SectionList({ 
    sections, 
    className, 
    role, 
    onRefresh, 
    onDelete, 
    onSubmission 
}: SectionListProps) {
    const { sections: sectionList, permissions } = sections;
    const { canCreate, canDelete } = permissions;
    
    // Safety check to prevent crashing if the section list is empty
    const courseId = sectionList.length > 0 ? sectionList[0].courseId : undefined;

    return (
        <TooltipProvider>
            <div className={cn("w-full flex flex-col gap-6 animate-in fade-in duration-500", className)}>
                
                {/* Header Toolbar */}
                {canCreate && (
                    <div className="flex justify-between items-center pb-4 border-b border-border/60">
                        <div className="flex items-center gap-2 text-foreground font-semibold">
                            <Layers className="w-5 h-5 text-primary" />
                            <h2>Course Modules</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="shadow-sm hover:bg-muted cursor-pointer" 
                                onClick={() => onRefresh && onRefresh()}
                            >
                                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                            </Button>
                            
                            {courseId && (
                                <CreateSectionDialog 
                                    courseId={courseId} 
                                    onSubmission={onSubmission}
                                    trigger={
                                        <Button size="sm" className="shadow-md shadow-primary/10 cursor-pointer">
                                            <Plus className="w-4 h-4 mr-2" />
                                            New Section
                                        </Button>
                                    } 
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {sectionList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-2xl bg-muted/5">
                        <div className="bg-background p-4 rounded-full shadow-sm mb-4 ring-1 ring-border/50">
                            <FolderX className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">No modules yet</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                            Sections and lessons will appear here once they are created.
                        </p>
                    </div>
                ) : (
                    /* Accordion List */
                    <Accordion type="multiple" className="w-full space-y-3">
                        {sectionList.map((section) => (
                            <AccordionItem 
                                key={section.id} 
                                value={section.id} 
                                className="border border-border/60 bg-card rounded-xl px-2 overflow-hidden shadow-sm data-[state=open]:border-primary/30 transition-colors"
                            >
                                <AccordionTrigger className="cursor-pointer px-3 hover:no-underline group">
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Layers className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-base tracking-tight group-hover:text-primary transition-colors">
                                            {section.title}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                
                                <AccordionContent className="pt-2 pb-4 px-1">
                                    
                                    {/* Teacher Action Bar (Inside Accordion) */}
                                    {(canCreate || canDelete) && (
                                        <div className="flex justify-end gap-2 mb-4 p-2 bg-muted/40 rounded-lg border border-border/40">
                                            {canCreate && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button asChild variant="ghost" size="sm" className="h-8 cursor-pointer text-primary hover:text-primary hover:bg-primary/10">
                                                            <Link href={`/${role}/courses/${section.courseId}/sections/${section.id}/lessons/create`}>
                                                                <Plus className="w-4 h-4 mr-1.5" />
                                                                Add Lesson
                                                            </Link>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Create a new lesson in this module</TooltipContent>
                                                </Tooltip>
                                            )}
                                            {canDelete && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-8 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10" 
                                                            onClick={() => onDelete && onDelete(section.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Delete entire section</TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    )}

                                    {/* Lessons List */}
                                    <div className="space-y-1.5">
                                        {section.lessons.length === 0 ? (
                                            <div className="text-xs text-muted-foreground italic px-4 py-2">
                                                No lessons in this section yet.
                                            </div>
                                        ) : (
                                            section.lessons.map((lesson) => {
                                                const isCompleted = role === "user" && lesson.progress.some(p => p.completed === true);
                                                
                                                return (
                                                    <Item key={lesson.id} className="border-none bg-transparent m-0 p-0">
                                                        <ItemContent className="p-0">
                                                            <ItemHeader className="p-0">
                                                                <Link 
                                                                    href={`/${role}/courses/${section.courseId}/sections/${section.id}/lessons/${lesson.id}`} 
                                                                    className="group/lesson flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/60 transition-all border border-transparent hover:border-border/60 cursor-pointer" 
                                                                >
                                                                    {/* Progress / Status Icon */}
                                                                    <div className="shrink-0">
                                                                        {role === "user" ? (
                                                                            isCompleted ? (
                                                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                                            ) : (
                                                                                <Circle className="w-5 h-5 text-muted-foreground/40 group-hover/lesson:text-primary/60 transition-colors" />
                                                                            )
                                                                        ) : (
                                                                            <PlayCircle className="w-5 h-5 text-muted-foreground/60 group-hover/lesson:text-primary transition-colors" />
                                                                        )}
                                                                    </div>
                                                                    
                                                                    <ItemTitle className="text-sm font-medium text-foreground/90 group-hover/lesson:text-foreground transition-colors truncate">
                                                                        {lesson.title}
                                                                    </ItemTitle>
                                                                </Link>
                                                            </ItemHeader>
                                                        </ItemContent>
                                                    </Item>
                                                );
                                            })
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>
        </TooltipProvider>
    );
}