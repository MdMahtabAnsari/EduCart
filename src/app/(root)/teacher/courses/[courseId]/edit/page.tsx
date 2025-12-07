import { api } from "@/trpc/server"
import { EditCourseForm } from "@/components/forms/course/edit-course";
import { Error as ErrorComp } from "@/components/error/error";

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
    let course;
    try {
        const { courseId } = await params;
        course = await api.teacher.course.getCourseById(courseId);

    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return <ErrorComp title="Failed to load course" description={message} />;
    }

    return (

        <EditCourseForm course={{
            id: course.id,
            title: course.title,
            description: course.description,
            media: {
                url: course.media.url,
                type: course.media.type,
            },
            published: course.published,
            price: Number(course.price).toFixed(2),
            offerPrice: course.offerPrice ? Number(course.offerPrice).toFixed(2) : undefined,
            level: course.level,
            categories: course.categories?.map(cat => cat.categoryId) ?? [],
            isFree: course.isFree,
            tags: course.tags.map(tag => tag.tagId) ?? [],
            language: course.languages.map(lang => lang.languageId) ?? [],

        }} />
    )
}

