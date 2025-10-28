import { getCourse } from "@/lib/api/teacher/course";


export default async function Page({ params }: { params: Promise<{ courseId: string }> }){
    const { courseId } = await params;
    const course = await getCourse(courseId);
    return (
        <div>
            {/* Course ID: {courseId} */}
            Course Title: {course}
        </div>
    )
}