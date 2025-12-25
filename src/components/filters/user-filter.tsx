import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { UserFilterForm,UserFilterFormProps } from "../forms/filters/user-filter";
import { ReactNode } from "react";


export interface UserFilterProps extends UserFilterFormProps {
    trigger: ReactNode;
}

export function UserFilter({
    onSubmit,
    defaultValues,
    trigger,
    show,
}: UserFilterProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent className=" overflow-scroll scrollbar-hide">
                <SheetHeader>
                    <SheetTitle>Filter Users</SheetTitle>
                    <SheetDescription>Use the form below to filter users.</SheetDescription>
                </SheetHeader>
                <UserFilterForm onSubmit={onSubmit} defaultValues={defaultValues} show={show} />
            </SheetContent>
        </Sheet>
    );
}