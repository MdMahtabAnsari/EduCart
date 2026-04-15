"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createSectionSchema, type CreateSectionSchema } from "@/lib/schema/section";
import { api } from "@/trpc/react";
import { authClient } from "@/lib/auth/auth-client";

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
import { Input } from "@/components/ui/input";
import { FolderPlus, Loader2, Type } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CreateSectionFormProps {
    courseId: string;
    onSubmission?: () => void;
}

/* -------------------------------------------------------------------------- */
/* Standalone Card Wrapper (Used when not inside a Dialog)                    */
/* -------------------------------------------------------------------------- */
export function CreateSectionForm({ courseId, onSubmission }: CreateSectionFormProps) {
    return (
        <Card className="w-full max-w-lg mx-auto h-fit border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* Premium Tinted Header */}
            <div className="bg-primary/5 p-6 pb-4 border-b border-border/40">
                <CardHeader className="p-0">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <FolderPlus className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                            Create New Section
                        </CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                        Add a new structural module to organize your course content.
                    </CardDescription>
                </CardHeader>
            </div>
            
            <CardContent className="p-6">
                <SectionForm courseId={courseId} onSubmission={onSubmission} />
            </CardContent>
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/* Reusable Form Component (Used in both Card and Dialog wrappers)            */
/* -------------------------------------------------------------------------- */
export function SectionForm({ courseId, onSubmission }: CreateSectionFormProps) {
    const { data: session } = authClient.useSession();
    
    // 1. Unconditionally call all hooks to satisfy React Rules
    const teacherMutation = api.teacher.section.createSection.useMutation();
    const adminMutation = api.admin.section.createSection.useMutation();

    const form = useForm<CreateSectionSchema>({
        resolver: zodResolver(createSectionSchema),
        defaultValues: {
            courseId,
            title: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (data: CreateSectionSchema) => {
        // 2. Safely determine the role at submission time
        const role = session?.user?.role;
        if (!role) {
            toast.error("Authentication error. Please log in again.");
            return;
        }

        // Select the correct mutation to fire
        const activeMutation = role === "teacher" ? teacherMutation : adminMutation;

        toast.promise(
            activeMutation.mutateAsync(data, {
                onSuccess: () => {
                    form.reset();
                    onSubmission?.();
                }
            }),
            {
                loading: "Creating module...",
                success: "Section created successfully!",
                error: (err) => `Failed to create: ${err.message}`,
            }
        );
    };

    const isSubmitting = form.formState.isSubmitting || teacherMutation.isPending || adminMutation.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-bold text-foreground">Section Title</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="e.g., Introduction to React Concepts"
                                        className={cn(
                                            "pl-9 h-11 bg-muted/40 border-border/60 transition-all duration-300",
                                            "focus-visible:ring-primary/20 focus-visible:border-primary",
                                            "placeholder:text-muted-foreground/50 font-medium"
                                        )}
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription className="text-xs text-muted-foreground/80">
                                Give your module a clear, descriptive name.
                            </FormDescription>
                            <FormMessage className="text-xs font-semibold" />
                        </FormItem>
                    )}
                />
                
                <div className="pt-2">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={!form.formState.isValid || isSubmitting}
                        className="w-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Creating Section...
                            </>
                        ) : (
                            <>
                                <FolderPlus className="w-5 h-5 mr-2" />
                                Create Section
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}