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
import { InstructorPermission } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { isEqual } from "@/lib/helpers/array/equal-array";
import { useEffect } from "react";
import { ShieldCheck, Percent, Save, Loader2} from "lucide-react";

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

    const isSubmitting = form.formState.isSubmitting;

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
                loading: "Updating instructor details...",
                success: "Instructor updated successfully! 🎉",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    // Real-time share validation logic
    useEffect(() => {
        if (occupiedShare !== undefined) {
            const currentShare = parseFloat(share || "0");
            const originalShare = parseFloat(values.share || "0");
            const totalOtherOccupied = Number(occupiedShare) - originalShare;
            
            if (currentShare + totalOtherOccupied > 100) {
                form.setError("share", {
                    type: "manual",
                    message: `Total revenue share cannot exceed 100%. Available: ${(100 - totalOtherOccupied).toFixed(2)}%`,
                });
            } else {
                form.clearErrors("share");
            }
        }
    }, [share, occupiedShare, form, values.share]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                
                {/* Section 1: Permissions */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        Step 1: Access Control
                    </div>
                    <FormField
                        control={form.control}
                        name="permissions"
                        render={({ field }) => (
                            <FormItem className="pl-6 border-l-2 border-muted space-y-4">
                                <div>
                                    <FormLabel className="text-base font-bold">Permissions</FormLabel>
                                    <FormDescription className="text-xs">
                                        Grant specific administrative rights to this instructor.
                                    </FormDescription>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                    {Object.values(InstructorPermission).map((permission) => {
                                        const formatted = permission.replaceAll("_", " ").toLowerCase();
                                        const isChecked = (field.value ?? []).includes(permission);

                                        return (
                                            <label
                                                key={permission}
                                                className={cn(
                                                    "flex items-start space-x-3 rounded-xl border p-3.5 transition-all cursor-pointer group",
                                                    isChecked
                                                        ? "bg-primary/5 border-primary shadow-sm"
                                                        : "bg-card hover:border-muted-foreground/30 hover:bg-muted/30",
                                                    isOwner && "opacity-60 cursor-not-allowed grayscale-[0.5]"
                                                )}
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={isChecked}
                                                        disabled={isOwner}
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(
                                                                checked
                                                                    ? [...(field.value ?? []), permission]
                                                                    : (field.value ?? []).filter((v) => v !== permission)
                                                            );
                                                        }}
                                                        className="mt-0.5 data-[state=checked]:bg-primary"
                                                    />
                                                </FormControl>
                                                <div className="space-y-0.5">
                                                    <span className="capitalize text-sm font-bold block group-hover:text-primary transition-colors">
                                                        {formatted}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground leading-tight block">
                                                        Enable {formatted} capabilities.
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                {/* Section 2: Earnings */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                        <Percent className="w-4 h-4" />
                        Step 2: Revenue Setup
                    </div>
                    <FormField
                        control={form.control}
                        name="share"
                        render={({ field }) => (
                            <FormItem className="pl-6 border-l-2 border-muted space-y-3">
                                <FormLabel className="text-base font-bold">Earnings Share</FormLabel>
                                <FormControl>
                                    <div className="relative max-w-50">
                                        <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...field}
                                            className="pr-10 font-mono text-lg focus-visible:ring-primary"
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Percentage of course revenue this instructor will receive.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                {/* Action Footer */}
                <div className="pt-6 border-t flex items-center justify-end gap-4">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={!form.formState.isValid || isSubmitting || form.formState.errors.share !== undefined}
                        className="min-w-37.5 shadow-lg shadow-primary/20 font-bold transition-all active:scale-95"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export const EditInstructorCard = ({ values, onSuccess, isOwner }: EditInstructorProps) => {
    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0 pb-6">
                <CardTitle className="text-2xl font-black tracking-tight">
                    Update Instructor
                </CardTitle>
                <CardDescription className="text-base">
                    Adjust the financial share and administrative rights for this team member.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <EditInstructorForm values={values} onSuccess={onSuccess} isOwner={isOwner} />
            </CardContent>
        </Card>
    );
};