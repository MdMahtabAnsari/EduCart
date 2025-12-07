import { api } from "@/trpc/server"
import { CourseDetails } from "@/components/course/course-details";
import { Error as ErrorComp } from "@/components/error/error";

export default async function Page({ params }: { params: Promise<{ courseId: string }> }){
    let course;
    try {
        const { courseId } = await params;
        course = await api.teacher.course.getCourseById(courseId);
    } catch (error) {
        console.error("Failed to load course:", error);
        const message = error instanceof Error ? error.message : String(error);
        return <ErrorComp title="Failed to load course" description={message} />;
    }
    return (
        <CourseDetails course={course} role="teacher" />
    )
}

