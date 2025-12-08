import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { InstructorFilterForm,type InstructorFilterFormProps } from "@/components/forms/filters/instructor-filter";
import { ReactNode } from "react";


export interface InstructorCourseFilterProps extends InstructorFilterFormProps {
    trigger: ReactNode;
}

export function InstructorCourseFilter({
    onSubmit,
    defaultValues,
    trigger,
    show,
}: InstructorCourseFilterProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent className=" overflow-scroll scrollbar-hide">
                <SheetHeader>
                    <SheetTitle>Filter Instructors Course</SheetTitle>
                    <SheetDescription>Use the form below to filter instructors course.</SheetDescription>
                </SheetHeader>
                <InstructorFilterForm onSubmit={onSubmit} defaultValues={defaultValues} show={show} />
            </SheetContent>
        </Sheet>
    );
}