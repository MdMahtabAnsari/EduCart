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


export interface InstructorFilterProps extends InstructorFilterFormProps {
    trigger: ReactNode;
}

export function InstructorFilter({
    onSubmit,
    defaultValues,
    trigger,
    show,
}: InstructorFilterProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent className=" overflow-scroll scrollbar-hide">
                <SheetHeader>
                    <SheetTitle>Filter Instructors</SheetTitle>
                    <SheetDescription>Use the form below to filter instructors.</SheetDescription>
                </SheetHeader>
                <InstructorFilterForm onSubmit={onSubmit} defaultValues={defaultValues} show={show} />
            </SheetContent>
        </Sheet>
    );
}