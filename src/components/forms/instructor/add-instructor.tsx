"use client";

import { api } from "@/trpc/react";
import { addInstructorToCourseSchema, type AddInstructorToCourseSchema } from "@/lib/schema/instructor";
import { TeacherCombobox } from "@/components/combobox/teacher-combobox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

export interface AddInstructorProps {
  courseId: string;
  onSuccess?: () => void;
}

export function AddInstructorForm({ courseId, onSuccess }: AddInstructorProps) {
  const form = useForm<AddInstructorToCourseSchema>({
    resolver: zodResolver(addInstructorToCourseSchema),
    defaultValues: {
      courseId,
      instructorId: "",
      permissions: [],
    },
    mode: "onChange",
  });


  const addInstructorMutation = api.teacher.instructor.addInstructorToCourse.useMutation();


  const onSubmit = (data: AddInstructorToCourseSchema) => {
    toast.promise(
      addInstructorMutation.mutateAsync(data, {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      }),
      {
        loading: "Adding instructor to course...",
        success: "Instructor added successfully! 🎉",
        error: (err) => `Error: ${err.message}`,
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-fadeIn">
        {/* Instructor Selector */}
        <FormField
          control={form.control}
          name="instructorId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold text-foreground">
                Instructor
              </FormLabel>
              <FormControl>
                <TeacherCombobox
                  courseId={courseId}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription className="text-sm text-muted-foreground">
                Choose an instructor to assign to this course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  const isChecked = field.value.includes(permission);

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
                                ? [...field.value, permission]
                                : field.value.filter((v) => v !== permission)
                            );
                          }}
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

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="px-6 font-semibold"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Adding..." : "Add Instructor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export const AddInstructorCard = ({ courseId, onSuccess }: AddInstructorProps) => {
  return (
    <Card className="border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2 border-b border-border/30">
        <CardTitle className="text-xl font-bold text-foreground">
          Add Instructor
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Assign a new instructor to this course and configure their permissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <AddInstructorForm courseId={courseId} onSuccess={onSuccess} />
      </CardContent>
    </Card>
  );
};
