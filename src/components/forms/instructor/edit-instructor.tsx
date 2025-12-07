"use client";

import { api } from "@/trpc/react";
import { editInstructorInCourseSchema, type EditInstructorInCourseSchema } from "@/lib/schema/instructor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { InstructorPermission } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils"; // if you have a classNames util
import { Input } from "@/components/ui/input";
import { isEqual } from "@/lib/helpers/array/equal-array";
import { useEffect } from "react";



export interface EditInstructorProps {
    values: EditInstructorInCourseSchema;
    onSuccess?: () => void;
    isOwner: boolean;
}

export function EditInstructorForm({ values, onSuccess, isOwner }: EditInstructorProps) {
    const form = useForm<EditInstructorInCourseSchema>({
        resolver: zodResolver(editInstructorInCourseSchema),
        defaultValues: values,
        mode: "onChange",
    });



    const editInstructorMutation = api.teacher.instructor.editInstructorInCourse.useMutation();
    const { data: occupiedShare } = api.teacher.instructor.getOccupiedShareInCourse.useQuery(values.courseId);
    const share = useWatch({
        control: form.control,
        name: "share",
    });

    const onSubmit = (data: EditInstructorInCourseSchema) => {

        const formattedData = {
            ...data,
            permissions: !isEqual(data.permissions ?? [], values.permissions ?? []) ? data.permissions : undefined,
            share: data.share === values.share ? undefined : data.share,
        };
        toast.promise(
            editInstructorMutation.mutateAsync(formattedData, {
                onSuccess: () => {
                    onSuccess?.();
                },
            }),
            {
                loading: "Editing instructor in course...",
                success: "Instructor edited successfully! 🎉",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    useEffect(() => {
        if (occupiedShare !== undefined && (parseFloat(share || "0") + Number(occupiedShare)) > 100) {
            form.setError("share", {
                type: "manual",
                message: `Total share exceeds 100%. Occupied share is ${occupiedShare}%.`,
            });
        }

    }, [share, occupiedShare, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-fadeIn">
                {/* Instructor Selector */}

                {/* Permissions */}
                <FormField
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="text-base font-semibold text-foreground">
                                Permissions
                            </FormLabel>
                            <FormDescription className="text-sm text-muted-foreground">
                                Select the permissions you want to grant this instructor.
                            </FormDescription>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                {Object.values(InstructorPermission).map((permission) => {
                                    const formatted = permission.replaceAll("_", " ").toLowerCase();
                                    const isChecked = (field.value ?? []).includes(permission);

                                    return (
                                        <FormItem
                                            key={permission}
                                            className={cn(
                                                "flex items-center space-x-3 rounded-md border p-3 transition-all",
                                                isChecked
                                                    ? "bg-accent/10 border-accent"
                                                    : "hover:bg-muted/40"
                                            )}
                                        >
                                            <FormControl>
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(
                                                            checked
                                                                ? [...(field.value ?? []), permission]
                                                                : (field.value ?? []).filter((v) => v !== permission)
                                                        );
                                                    }}
                                                    disabled={isOwner}
                                                />
                                            </FormControl>
                                            <Label className="capitalize text-sm font-medium">
                                                {formatted}
                                            </Label>
                                        </FormItem>
                                    );
                                })}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="share"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="text-base font-semibold text-foreground">
                                Instructor
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Instructor Name"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription className="text-sm text-muted-foreground">
                                Specify the share percentage for this instructor.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit */}
                <div className="pt-4 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        className="px-6 font-semibold"
                        disabled={!form.formState.isValid || form.formState.isSubmitting || occupiedShare !== undefined && (parseFloat(share || "0") + Number(occupiedShare)) > 100}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export const EditInstructorCard = ({ values, onSuccess, isOwner }: EditInstructorProps) => {
    return (
        <Card className="border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2 border-b border-border/30">
                <CardTitle className="text-xl font-bold text-foreground">
                    Edit Instructor
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Specify the share percentage for this instructor and configure their permissions.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <EditInstructorForm values={values} onSuccess={onSuccess} isOwner={isOwner} />
            </CardContent>
        </Card>
    );
};
