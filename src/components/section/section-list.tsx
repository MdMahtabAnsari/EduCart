import { SectionRouterOutputs } from "@/server/api/routers/teacher/section";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Item,
    // ItemActions,
    ItemContent,
    //   ItemDescription,
    // ItemFooter,
    ItemHeader,
    // ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { RotateCcw, Plus, Trash, Check, X } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreateSectionDialog } from "@/components/dialog/section/create-section-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SectionListProps {
    sections: SectionRouterOutputs["getSectionsByCourseId"];
    className?: string;
    role: string;
    onRefresh?: () => void;
    onDelete?: (sectionId: string) => void;
    onSubmission?: () => void;
}


export function SectionList({ sections, className, role, onRefresh, onDelete, onSubmission }: SectionListProps) {
    const { sections: sectionList, permissions } = sections;
    const { canCreate, canDelete } = permissions;
    return (
        <div className={`w-full flex flex-col gap-4 ${className}`}>
            {canCreate && (
                <div className="flex justify-end items-center gap-2">
                    <CreateSectionDialog courseId={sectionList[0].courseId} onSubmission={onSubmission}
                        trigger={
                            <Button className="cursor-pointer" size="sm">

                                <Plus />
                                Create Section
                            </Button>
                        } />
                    <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => onRefresh && onRefresh()}>
                        <RotateCcw />
                    </Button>
                </div>
            )}
            <Accordion type="multiple" className={`w-full`}>
                {sectionList.map((section) => (
                    <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="cursor-pointer">{section.title}</AccordionTrigger>
                        <AccordionContent>
                            {(canCreate || canDelete) && (
                                <div className="flex justify-end mb-3">
                                    {canCreate && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link href={`/${role}/courses/${section.courseId}/sections/${section.id}/lessons/create`}>
                                                    <Button className="cursor-pointer" variant="ghost" size="icon"><Plus /></Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Add Lesson
                                            </TooltipContent>
                                        </Tooltip>
                                    )
                                    }
                                    {canDelete && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => onDelete && onDelete(section.id)}><Trash /></Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Delete Section
                                            </TooltipContent>
                                        </Tooltip>
                                    )
                                    }

                                </div>

                            )}
                            {section.lessons.map((lesson) => (
                                <Item key={lesson.id} className="mb-2">
                                    <ItemContent>
                                        <ItemHeader>
                                            <Link href={`/${role}/courses/${section.courseId}/sections/${section.id}/lessons/${lesson.id}`} className="cursor-pointer" >
                                                <ItemTitle className="flex gap-2">{role === "user" && lesson.progress.find(p => p.completed === true) ? <Check className=" text-green-500" /> : (role === 'user' && <X className=" text-red-500" />)}{lesson.title}</ItemTitle>
                                            </Link>
                                        </ItemHeader>
                                    </ItemContent>
                                </Item>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}