import { CreateSectionForm } from "@/components/forms/section/create-section";


export default async function Page({ params }: { params: Promise<{ courseId: string }> }){
    const { courseId } = await params;
    return (
        <CreateSectionForm courseId={courseId} />
    )
}