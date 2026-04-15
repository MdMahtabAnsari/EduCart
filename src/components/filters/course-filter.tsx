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
import { CourseFilterForm, type CourseFilterFormProps } from "@/components/forms/filters/course-filter";
import { SlidersHorizontal } from "lucide-react";

export interface CourseFilterProps extends CourseFilterFormProps {
  trigger: ReactNode;
}

export function CourseFilter({
  onSubmit,
  defaultValues,
  trigger,
  showFields
}: CourseFilterProps) {
  const [open, setOpen] = useState(false);

  // Intercept the submit to apply the filters and close the drawer
  const handleSubmit = (...args: Parameters<typeof onSubmit>) => {
    onSubmit(...args);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      {/* Removed scrollbar-hide and set padding to 0 so we can control inner spacing */}
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0 shadow-2xl">
        
        {/* Sticky Header */}
        <SheetHeader className="px-6 py-5 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10">
          <SheetTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            Filter Courses
          </SheetTitle>
          <SheetDescription className="text-sm">
            Narrow down the catalog to find exactly what you need.
          </SheetDescription>
        </SheetHeader>
        
        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
          <CourseFilterForm 
            onSubmit={handleSubmit} 
            defaultValues={defaultValues} 
            showFields={showFields} 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}