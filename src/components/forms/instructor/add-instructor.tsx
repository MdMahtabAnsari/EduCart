"use client";

import { api } from "@/trpc/react";
import { addInstructorToCourseSchema, type AddInstructorToCourseSchema } from "@/lib/schema/instructor";
import { TeacherCombobox } from "@/components/combobox/teacher-combobox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm,useWatch } from "react-hook-form";
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
import { UserPlus2, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";

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
        loading: "Sending invitation...",
        success: "Instructor invited successfully! 🎉",
        error: (err) => `Error: ${err.message}`,
      }
    );
  };

  const allPermissions = Object.values(InstructorPermission);
  const selectedPermissions = useWatch({ control: form.control, name: "permissions" });

  const toggleAll = () => {
    if (selectedPermissions.length === allPermissions.length) {
      form.setValue("permissions", [], { shouldValidate: true });
    } else {
      form.setValue("permissions", allPermissions, { shouldValidate: true });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Step 1: User Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
            <UserPlus2 className="w-4 h-4" />
            Step 1: Identify Instructor
          </div>
          <FormField
            control={form.control}
            name="instructorId"
            render={({ field }) => (
              <FormItem className="space-y-3 pl-6 border-l-2 border-muted">
                <FormLabel className="text-base font-bold">Select Teacher</FormLabel>
                <FormControl>
                  <TeacherCombobox
                    courseId={courseId}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Search for a verified teacher by name or email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Step 2: Permissions Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Step 2: Configure Access
            </div>
            <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={toggleAll}
                className="text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              {selectedPermissions.length === allPermissions.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
          
          <FormField
            control={form.control}
            name="permissions"
            render={() => (
              <FormItem className="pl-6 border-l-2 border-muted">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {allPermissions.map((permission) => {
                    const formatted = permission.replaceAll("_", " ").toLowerCase();
                    const isChecked = selectedPermissions.includes(permission);

                    return (
                      <label
                        key={permission}
                        className={cn(
                          "flex items-start space-x-3 rounded-xl border p-3.5 transition-all cursor-pointer group",
                          isChecked
                            ? "bg-primary/5 border-primary shadow-[0_0_0_1px_rgba(var(--primary),0.1)]"
                            : "bg-card hover:border-muted-foreground/30 hover:bg-muted/30"
                        )}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("permissions");
                            form.setValue(
                              "permissions",
                              checked
                                ? [...current, permission]
                                : current.filter((v) => v !== permission),
                              { shouldValidate: true }
                            );
                          }}
                          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div className="space-y-1">
                          <span className="capitalize text-sm font-bold block group-hover:text-primary transition-colors">
                            {formatted}
                          </span>
                          <span className="text-[10px] text-muted-foreground leading-tight block">
                            Allow the instructor to {formatted} content.
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

        {/* Action Button */}
        <div className="pt-6 border-t flex items-center justify-end gap-4">
            <p className="text-xs text-muted-foreground hidden sm:block">
                An invitation will be sent to the selected instructor.
            </p>
            <Button
                type="submit"
                size="lg"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                className="min-w-40 shadow-lg shadow-primary/20 font-bold transition-all active:scale-95"
            >
                {form.formState.isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Assign Instructor
                    </>
                )}
            </Button>
        </div>
      </form>
    </Form>
  );
}

export const AddInstructorCard = ({ courseId, onSuccess }: AddInstructorProps) => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-6">
        <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
            Add Team Member
        </CardTitle>
        <CardDescription className="text-base">
          Collaborate with other instructors by granting them specific course management rights.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <AddInstructorForm courseId={courseId} onSuccess={onSuccess} />
      </CardContent>
    </Card>
  );
};