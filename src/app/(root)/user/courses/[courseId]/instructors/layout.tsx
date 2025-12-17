import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title : "Course Instructors - Educart",
    description : "Manage course instructors and their roles.",
};

export default function TeacherCourseRequestsLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}