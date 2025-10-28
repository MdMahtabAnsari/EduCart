"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { courseSchemaFrontEnd, type CourseSchemaFrontEnd } from "@/lib/schema/course";

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

import { CourseLevel, Language, Currency } from "@/generated/prisma/enums";

import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { CldUploadWidget, CloudinaryUploadWidgetResults, CloudinaryUploadWidgetError, CldImage, CldVideoPlayer } from 'next-cloudinary';
import { createCourse } from "@/lib/api/teacher/course";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FaUpload, FaCheckCircle } from "react-icons/fa";

export function CreateCourseForm() {
    const form = useForm<CourseSchemaFrontEnd>({
        resolver: zodResolver(courseSchemaFrontEnd),
        defaultValues: {
            instructor: [],
            language: Language.ENGLISH,
            currency: Currency.USD,
            level: CourseLevel.BEGINNER,
            isActive: true,
            isFree: false,
            published: false,
        },
        mode: "onChange",
    });
    const media = useWatch({ control: form.control, name: 'media' });

    const onSubmit = async (data: CourseSchemaFrontEnd) => {
        toast.promise(
            createCourse(data),
            {
                loading: 'Creating course...',
                success: 'Course created successfully!',
                error: (err) => `Error creating course: ${err.message}`,
            }
        );
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border border-gray-200">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Create New Course</CardTitle>
                <CardDescription className="text-gray-500">Fill in the details to create a new course.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Course Info Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-700">Course Info</h2>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter course title" {...field} className="focus:ring-primary" />
                                        </FormControl>
                                        <FormDescription>Enter the title of the course.</FormDescription>
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
                                            <div className="border rounded-lg overflow-hidden">
                                                <MinimalTiptapEditor
                                                    {...field}
                                                    className="min-h-64"
                                                    editorContentClassName="p-4"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>Enter a brief description of the course.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />
                        {/* Media Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-700">Course Media</h2>
                            {
                                media?.type === 'IMAGE' && media?.url ? (
                                    <div className="w-full flex justify-center items-center">
                                        <CldImage
                                            src={media.url}
                                            width={400}
                                            height={300}
                                            alt="Course Media"
                                            className="rounded-md shadow"
                                        />
                                    </div>
                                ) : media?.type === 'VIDEO' && media?.url ? (
                                    <div className="w-full flex justify-center items-center">
                                        <CldVideoPlayer
                                            src={media.url}
                                            width={400}
                                            height={300}
                                            className="rounded-md w-44 h-44 shadow"
                                        />
                                    </div>
                                ) : null
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
                                                    maxImageFileSize: 5 * 1024 * 1024, // 5MB
                                                    maxVideoFileSize: 50 * 1024 * 1024, // 50MB
                                                    sources: ['local', 'camera'],
                                                    cropping: true,
                                                    folder: 'educart/courses',
                                                    resourceType: 'auto',
                                                    clientAllowedFormats: ['png', 'jpeg', 'jpg', 'mp4'],
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
                                        <FormDescription>Upload an image or video for the course.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />
                        {/* Settings Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="published"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Published</FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="accent-primary"
                                            />
                                        </FormControl>
                                        <FormDescription>Mark the course as published.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Active</FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="accent-primary"
                                            />
                                        </FormControl>
                                        <FormDescription>Mark the course as active.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isFree"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Free</FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="accent-primary"
                                            />
                                        </FormControl>
                                        <FormDescription>Mark the course as free.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />
                        {/* Pricing Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Course Price" {...field} className="focus:ring-primary" />
                                        </FormControl>
                                        <FormDescription>Set the price for the course.</FormDescription>
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
                                            <Input placeholder="Offer Price (optional)" {...field} className="focus:ring-primary" />
                                        </FormControl>
                                        <FormDescription>Set a discounted price for the course.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />
                        {/* Selectors Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="categories"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categories</FormLabel>
                                        <FormControl>
                                            <CategorySelector
                                                selected={field.value ?? []}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormDescription>Select categories for the course.</FormDescription>
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
                                            <TagSelector
                                                selected={field.value ?? []}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormDescription>Select tags for the course.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />
                        {/* Language & Currency Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="language"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Language</FormLabel>
                                        <FormControl>
                                            <Select defaultValue={field.value} onValueChange={field.onChange} {...field}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Language</SelectLabel>
                                                        {Object.values(Language).map((language) => (
                                                            <SelectItem key={language} value={language}>
                                                                {language}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>Set the language for the course.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <FormControl>
                                            <Select defaultValue={field.value} onValueChange={field.onChange} {...field}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Currency</SelectLabel>
                                                        {Object.values(Currency).map((currency) => (
                                                            <SelectItem key={currency} value={currency}>
                                                                {currency}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>Set the currency for the course.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator />
                        <Button
                            type="submit"
                            disabled={!form.formState.isValid || form.formState.isSubmitting}
                            className="w-full cursor-pointer bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2"
                        >
                            <FaCheckCircle />
                            Create Course
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}