import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CourseFilterForm, type CourseFilterFormProps } from "@/components/forms/filters/course-filter";
import { ReactNode } from "react";


export interface CourseFilterProps extends CourseFilterFormProps {
  trigger: ReactNode;
}

export function CourseFilter({
  onSubmit,
  defaultValues,
  trigger,
  showFields
}: CourseFilterProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className=" overflow-scroll scrollbar-hide">
        <SheetHeader>
          <SheetTitle>Filter Courses</SheetTitle>
          <SheetDescription>Use the form below to filter courses.</SheetDescription>
        </SheetHeader>
        <CourseFilterForm onSubmit={onSubmit} defaultValues={defaultValues} showFields={showFields} />
      </SheetContent>
    </Sheet>
  );
}