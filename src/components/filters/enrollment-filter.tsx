"use client";

import { useState, type ReactNode } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { EnrollmentFilterForm, type EnrollmentFilterFormProps } from "@/components/forms/filters/enrollment-filter";
import { SlidersHorizontal } from "lucide-react";

export interface EnrollmentFilterProps extends EnrollmentFilterFormProps {
    trigger: ReactNode;
}

export function EnrollmentFilter({
    onSubmit,
    defaultValues,
    trigger,
    show,
}: EnrollmentFilterProps) {
    const [open, setOpen] = useState(false);

    // Intercept the submit to apply the filters and automatically close the drawer
    const handleSubmit = (...args: Parameters<typeof onSubmit>) => {
        onSubmit(...args);
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            
            {/* Removed scrollbar-hide and set padding to 0 for strict layout control */}
            <SheetContent className="flex flex-col w-full sm:max-w-md p-0 shadow-2xl">
                
                {/* Sticky Header */}
                <SheetHeader className="px-6 py-5 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10">
                    <SheetTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                        <SlidersHorizontal className="w-5 h-5 text-primary" />
                        Filter Enrollments
                    </SheetTitle>
                    <SheetDescription className="text-sm">
                        Narrow down the student enrollment list based on your criteria.
                    </SheetDescription>
                </SheetHeader>
                
                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                    <EnrollmentFilterForm 
                        onSubmit={handleSubmit} 
                        defaultValues={defaultValues} 
                        show={show} 
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}