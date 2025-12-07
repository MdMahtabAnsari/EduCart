"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { editCourseSchemaFrontEnd, type EditCourseSchemaBackEnd, type EditCourseSchemaFrontEnd } from "@/lib/schema/course";

import { Button } from "@/components/ui/button";
import { TagSelector } from "@/components/selectors/tag-selector";
import { CategorySelector } from "@/components/selectors/category-selector";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { CourseLevel } from "@/generated/prisma/enums";
import { LanguageSelector } from "@/components/selectors/language-selector";

import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { CldUploadWidget, CloudinaryUploadWidgetResults, CloudinaryUploadWidgetError } from "next-cloudinary";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { UploadCloud, CheckCircle, Info, IndianRupee } from "lucide-react";
import { useEffect } from "react";
import { api } from "@/trpc/react";
import { Media } from "@/components/media/media";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {isEqual} from "@/lib/helpers/array/equal-array";
interface EditCourseFormProps {
    course: EditCourseSchemaFrontEnd;
}

export function EditCourseForm({ course }: EditCourseFormProps) {
    const form = useForm<EditCourseSchemaFrontEnd>({
        resolver: zodResolver(editCourseSchemaFrontEnd),
        defaultValues: course,
        mode: "onChange",
    });

    const editCourseMutation = api.teacher.course.editCourse.useMutation();
    const media = useWatch({ control: form.control, name: "media" });
    const isFree = useWatch({ control: form.control, name: "isFree" });
    const price = useWatch({ control: form.control, name: "price" });
    const offerPrice = useWatch({ control: form.control, name: "offerPrice" });

    useEffect(() => {
        if (isFree) {
            form.setValue("price", "0");
            form.setValue("offerPrice", "0");
        }
    }, [isFree, form]);

    const onSubmit = async (data: EditCourseSchemaFrontEnd) => {
        const formatData = {
            id: data.id,
            title: data.title === course.title ? undefined : data.title,
            description: data.description === course.description ? undefined : data.description,
            media: data.media?.url === course.media?.url ? undefined : data.media,
            published: data.published === course.published ? undefined : data.published,
            price: data.price === course.price ? undefined : data.price,
            offerPrice: data.offerPrice === course.offerPrice ? undefined : data.offerPrice,
            level: data.level === course.level ? undefined : data.level,
            categories: !isEqual(course.categories ?? [], data.categories ?? []) ? data.categories : undefined,
            isFree: data.isFree === course.isFree ? undefined : data.isFree,
            tags: !isEqual(course.tags ?? [], data.tags ?? []) ? data.tags : undefined,
        };

        toast.promise(editCourseMutation.mutateAsync(formatData as EditCourseSchemaBackEnd), {
            loading: "Updating course...",
            success: "Course updated successfully!",
            error: (err) => `Error updating course: ${err.message}`,
        });
    };

    const offerHigherThanPrice =
        !isFree &&
        parseFloat(offerPrice ?? "0") > parseFloat(price ?? "0") &&
        parseFloat(price ?? "0") > 0;

    return (
        <Card className="w-full max-w-3xl mx-auto shadow-sm border">
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold">Edit Course</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    Update details, media, pricing, and metadata.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                        {/* Course Info */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Course Info</h2>
                                <span className="text-muted-foreground text-sm">Basic details</span>
                            </div>
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Mastering TypeScript" {...field} className="focus:ring-primary" />
                                            </FormControl>
                                            <FormDescription>Clear, concise course title.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <div className="rounded-lg border bg-card">
                                                    <MinimalTiptapEditor {...field} className="min-h-64" editorContentClassName="p-4" />
                                                </div>
                                            </FormControl>
                                            <FormDescription>Short overview of the course.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        <Separator />

                        {/* Media */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Media</h2>
                                <span className="text-muted-foreground text-sm">Thumbnail or intro video</span>
                            </div>

                            {media?.url && (
                                <AspectRatio ratio={16 / 9} className="rounded-lg border overflow-hidden bg-muted">
                                    <Media key={media.url} url={media.url} type={media.type} className="w-full h-full object-cover" alt="Course Media" />
                                </AspectRatio>
                            )}

                            <FormField
                                control={form.control}
                                name="media"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Media</FormLabel>
                                        <FormControl>
                                            <CldUploadWidget
                                                signatureEndpoint="/api/sign-cloudinary-params"
                                                uploadPreset="educart"
                                                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                                                    if (typeof result.info !== "string" && result.info?.secure_url && result.info.resource_type) {
                                                        field.onChange({
                                                            url: result.info.secure_url,
                                                            type: result.info.resource_type === "image" ? "IMAGE" : "VIDEO",
                                                        });
                                                        toast.success("Media uploaded successfully!");
                                                    }
                                                }}
                                                onError={(error: CloudinaryUploadWidgetError) => {
                                                    toast.error(`Image upload failed: ${error}`);
                                                }}
                                                options={{
                                                    maxFiles: 1,
                                                    maxImageFileSize: 5 * 1024 * 1024,
                                                    maxVideoFileSize: 50 * 1024 * 1024,
                                                    sources: ["local", "camera"],
                                                    cropping: true,
                                                    folder: "educart/courses",
                                                    resourceType: "auto",
                                                    clientAllowedFormats: ["png", "jpeg", "jpg", "mp4"],
                                                    multiple: false,
                                                }}
                                            >
                                                {({ open }) => (
                                                    <Button type="button" variant="outline" onClick={() => open?.()} className="w-full flex items-center gap-2 cursor-pointer">
                                                        <UploadCloud className="text-primary h-4 w-4" />
                                                        Upload or Replace Media
                                                    </Button>
                                                )}
                                            </CldUploadWidget>
                                        </FormControl>
                                        <FormDescription>Recommended 16:9 image or short intro video.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </section>

                        <Separator />

                        {/* Settings */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Settings</h2>
                                <span className="text-muted-foreground text-sm">Publishing and access</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="published"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel>Published</FormLabel>
                                                <FormDescription>Visible to learners.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isFree"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel>Free</FormLabel>
                                                <FormDescription>No payment required.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        <Separator />

                        {/* Pricing */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Pricing</h2>
                                <span className="text-muted-foreground text-sm">Set base and offer prices</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <IndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        inputMode="decimal"
                                                        placeholder="e.g., 999"
                                                        {...field}
                                                        disabled={isFree}
                                                        className="pl-8 focus:ring-primary"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription>Base price (INR). Set to 0 for free courses.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="offerPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Offer Price</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <IndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        inputMode="decimal"
                                                        placeholder="e.g., 799"
                                                        {...field}
                                                        disabled={isFree}
                                                        className="pl-8 focus:ring-primary"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription>Optional discount price (≤ base price).</FormDescription>
                                            {offerHigherThanPrice && (
                                                <p className="text-sm text-destructive mt-2">Offer price cannot be greater than base price.</p>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        <Separator />

                        {/* Metadata */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Metadata</h2>
                                <span className="text-muted-foreground text-sm">Organize and categorize</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="categories"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categories</FormLabel>
                                            <FormControl>
                                                <CategorySelector selected={field.value ?? []} onChange={field.onChange} />
                                            </FormControl>
                                            <FormDescription>Choose one or more categories.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <TagSelector selected={field.value ?? []} onChange={field.onChange} />
                                            </FormControl>
                                            <FormDescription>Add descriptive tags.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="language"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Language</FormLabel>
                                            <FormControl>
                                                <LanguageSelector selected={field.value ?? []} onChange={field.onChange} />
                                            </FormControl>
                                            <FormDescription>Primary languages for the course.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Level</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="focus:ring-primary">
                                                        <SelectValue placeholder="Select Level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Level</SelectLabel>
                                                            {Object.values(CourseLevel).map((level) => (
                                                                <SelectItem key={level} value={level}>
                                                                    {level}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>Difficulty level of the course.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        {/* Submit */}
                        <div className="sticky bottom-0 bg-card/80 backdrop-blur supports-backdrop-filter:bg-card/60 pt-4">
                            <Button
                                type="submit"
                                disabled={!form.formState.isValid || form.formState.isSubmitting || offerHigherThanPrice}
                                className="w-full cursor-pointer"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Update Course
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}