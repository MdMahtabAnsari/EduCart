import { LessonDetails } from "@/components/lesson/lesson-details";
import { api } from "@/trpc/server";
import { Error as ErrorComp } from "@/components/error/error";

export default async function Page({ params }: { params: Promise<{ courseId: string; sectionId: string; lessonId: string }> }) {

    let lesson;
    try {
        const { lessonId } = await params;
        lesson = await api.user.lesson.getLessonById(lessonId);

    } catch (error) {
        console.error("Failed to load lesson:", error);
        const message = error instanceof Error ? error.message : String(error);
        return <ErrorComp title="Failed to load lesson" description={message} />;
    }
    return <LessonDetails lesson={lesson} role="user" />;
}