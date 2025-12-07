import { EnrollmentList } from "@/components/enrollment/enrollment-list"


export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;

    return (
        <EnrollmentList courseId={courseId} />
    )
}