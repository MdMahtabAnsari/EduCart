
import { InfiniteSection } from "@/components/section/infinite-section";

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    return <InfiniteSection courseId={courseId} role="teacher" />;
}