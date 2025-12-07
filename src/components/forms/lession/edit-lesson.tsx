"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { editLessionSchemaFrontEnd, type EditLessionSchemaFrontEnd, type EditLessionSchemaBackEnd } from "@/lib/schema/lession";
import { api } from "@/trpc/react";
import { Media } from "@/components/media/media";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FaUpload, FaCheckCircle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { CldUploadWidget, CloudinaryUploadWidgetResults, CloudinaryUploadWidgetError } from 'next-cloudinary';
import { LessonRouterOutputs } from "@/server/api/routers/teacher/lesson";

interface EditLessionProps {
    lesson: LessonRouterOutputs['getLessonById']['lesson'];
}

export function EditLesson({ lesson }: EditLessionProps) {
    const form = useForm<EditLessionSchemaFrontEnd>({
        resolver: zodResolver(editLessionSchemaFrontEnd),
        defaultValues: {
            id: lesson.id,
            sectionId: lesson.sectionId,
            title: lesson.title,
            content: lesson.content,
            media: lesson.media,
        },
        mode: "onChange",
    });
    const media = useWatch({ control: form.control, name: 'media' });
    const editLesson = api.teacher.lesson.editLesson.useMutation();

    const onSubmit = async (data: EditLessionSchemaFrontEnd) => {
        toast.promise(
            editLesson.mutateAsync(data as EditLessionSchemaBackEnd),
            {
                loading: "Updating lesson...",
                success: "Lesson updated successfully!",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Edit Lesson</CardTitle>
                <CardDescription >Update the details of the lesson.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold">Lesson Details</h2>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter lesson title" {...field} className="focus:ring-primary" />
                                        </FormControl>
                                        <FormDescription>Enter the title of the lesson.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <div className="border rounded-lg overflow-hidden">
                                                <MinimalTiptapEditor
                                                    {...field}
                                                    className="min-h-64"
                                                    editorContentClassName="p-4"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>Add the main content for the lesson.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />
                        {/* Media Section */}
                        <div className="space-y-6">

                            {
                                media && (
                                    <>
                                        <h2 className="text-lg font-semibold">Lession Media</h2>
                                        <AspectRatio ratio={16 / 9}>
                                            <Media key={media.url} url={media.url} type={media.type} />
                                        </AspectRatio>
                                    </>
                                )
                            }
                            <FormField
                                control={form.control}
                                name="media"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Media</FormLabel>
                                        <FormControl>
                                            <CldUploadWidget
                                                signatureEndpoint="/api/sign-cloudinary-params"
                                                uploadPreset='educart'
                                                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                                                    if (typeof result.info !== 'string' && result.info?.secure_url && result.info.resource_type) {
                                                        field.onChange({
                                                            url: result.info.secure_url,
                                                            type: result.info.resource_type === 'image' ? 'IMAGE' : 'VIDEO',
                                                        });
                                                        toast.success("Media uploaded successfully!");
                                                    }
                                                }}
                                                onError={(error: CloudinaryUploadWidgetError) => {
                                                    toast.error(`Image upload failed: ${error}`);
                                                }}
                                                options={{
                                                    maxFiles: 1,
                                                    // maxImageFileSize: 5 * 1024 * 1024, // 5MB
                                                    maxVideoFileSize: 50 * 1024 * 1024, // 50MB
                                                    sources: ['local', 'camera'],
                                                    cropping: true,
                                                    folder: 'educart/courses/lessons',
                                                    resourceType: 'auto',
                                                    clientAllowedFormats: ['mp4'],
                                                    multiple: false,
                                                }}
                                            >
                                                {({ open }) => (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => open?.()}
                                                        className="w-full flex items-center gap-2"
                                                    >
                                                        <FaUpload className="text-primary" />
                                                        Upload Media
                                                    </Button>
                                                )}
                                            </CldUploadWidget>
                                        </FormControl>
                                        <FormDescription>Upload an video for the lesson.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />
                        <Button
                            type="submit"
                            disabled={!form.formState.isValid || form.formState.isSubmitting}
                            className="w-full cursor-pointer"
                        >
                            <FaCheckCircle />
                            Update Lesson
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}