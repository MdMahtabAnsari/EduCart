import { CreateLesson } from "@/components/forms/lession/create-lesson";
import { api } from "@/trpc/server";
import { Error as ErrorComp } from "@/components/error/error";


export default async function Page({ params }: { params: Promise<{ courseId: string, sectionId: string }> }) {
    const { courseId, sectionId } = await params;
    try {

        await api.teacher.section.getSectionById(sectionId);


    } catch (error) {
        console.error("Error fetching section:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return <ErrorComp title="Failed to load section" description={errorMessage} />;
    }
    return <CreateLesson courseId={courseId} sectionId={sectionId} />;

}
