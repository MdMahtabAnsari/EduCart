import { InfiniteLesson } from "@/components/lesson/infinite-lesson";
export default async function Page({ params }: { params: Promise<{ courseId: string; sectionId: string }> }) {
    const {  sectionId,courseId } = await params;
    return <InfiniteLesson sectionId={sectionId} courseId={courseId} role="user" />;
}