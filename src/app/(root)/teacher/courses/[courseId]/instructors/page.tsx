import { InstructorList } from "@/components/instructor/instructor-list";

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;

    return (
        <InstructorList courseId={courseId} />
    )
}