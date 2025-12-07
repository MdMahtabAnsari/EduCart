import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { EnrollmentFilterForm, type EnrollmentFilterFormProps } from "@/components/forms/filters/enrollment-filter";
import { ReactNode } from "react";


export interface EnrollmentFilterProps extends EnrollmentFilterFormProps {
    trigger: ReactNode;
}

export function EnrollmentFilter({
    onSubmit,
    defaultValues,
    trigger,
    show,
}: EnrollmentFilterProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent className=" overflow-scroll scrollbar-hide">
                <SheetHeader>
                    <SheetTitle>Filter Enrollments</SheetTitle>
                    <SheetDescription>Use the form below to filter enrollments.</SheetDescription>
                </SheetHeader>
                <EnrollmentFilterForm onSubmit={onSubmit} defaultValues={defaultValues} show={show} />
            </SheetContent>
        </Sheet>
    );
}