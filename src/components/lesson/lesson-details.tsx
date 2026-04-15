"use client";
import { LessonRouterOutputs } from "@/server/api/routers/teacher/lesson";


// import { LessonRouterOutputs } from "@/server/api/routers/teacher/section";
import { Media } from "@/components/media/media";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import parse from "html-react-parser";
import { InfiniteComment } from "@/components/comment/infinite-comment";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    Trash2, 
    SquarePen, 
    Menu, 
    CheckCircle2, 
    PlayCircle,
    MessageSquare,
    Eye
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { SectionSheet } from "@/components/section/section-sheet";
import { cn } from "@/lib/utils";

interface LessonDetailsProps {
    lesson: LessonRouterOutputs["getLessonById"];
    role: string;
}

export function LessonDetails({ lesson, role }: LessonDetailsProps) {
    const { lesson: lessonData, permissions } = lesson;
    const { canDelete, canUpdate } = permissions;
    const { title, content, media, order, isPreview, section, sectionId, progress, id } = lessonData;
    const { courseId } = section;
    
    const isCompleted = progress.some(p => p.completed);
    const router = useRouter();
    
    const deleteLessonMutation = api.teacher.lesson.deleteLesson.useMutation();
    const completeLessonMutation = api.user.lesson.makeLessonComplete.useMutation();

    const onDelete = () => {
        toast.promise(
            deleteLessonMutation.mutateAsync(id, {
                onSuccess: () => {
                    router.push(`/${role}/courses/${courseId}/sections/${sectionId}/lessons`);
                },
            }),
            {
                loading: "Removing lesson...",
                success: "Lesson removed successfully",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    const onComplete = () => {
        toast.promise(
            completeLessonMutation.mutateAsync(id, {
                onSuccess: () => {
                    router.refresh();
                },
            }),
            {
                loading: "Updating progress...",
                success: "Lesson marked as complete! 🎉",
                error: (err) => `Error: ${err.message}`,
            }
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
            
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <SectionSheet
                    courseId={courseId}
                    role={role}
                    trigger={
                        <Button variant="outline" className="shadow-sm cursor-pointer hover:bg-muted transition-colors">
                            <Menu className="w-4 h-4 mr-2" />
                            Course Curriculum
                        </Button>
                    }
                />
                
                {/* Status Indicator (User View) */}
                {role === 'user' && (
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-colors",
                        isCompleted 
                            ? "bg-emerald-500/10 text-emerald-600" 
                            : "bg-muted text-muted-foreground"
                    )}>
                        {isCompleted ? (
                            <><CheckCircle2 className="w-4 h-4" /> Completed</>
                        ) : (
                            <><PlayCircle className="w-4 h-4" /> In Progress</>
                        )}
                    </div>
                )}
            </div>

            {/* Hero Section: Media Player */}
            <div className="w-full rounded-2xl overflow-hidden border border-border/40 shadow-xl bg-black/5 ring-1 ring-border/50">
                <div className="aspect-video w-full bg-black flex items-center justify-center">
                    <Media url={media.url} type={media.type} className="w-full h-full object-contain" />
                </div>
            </div>

            {/* Title & Action Bar */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 px-2">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">
                            Lesson {order}
                        </span>
                        {isPreview && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                                <Eye className="w-3 h-3 mr-1" /> Preview Enabled
                            </Badge>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
                        {title}
                    </h1>
                </div>

                {/* Actions (Teacher vs User) */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {role === 'teacher' && (
                        <div className="flex items-center gap-2 p-1.5 bg-muted/50 border rounded-lg">
                            {canUpdate && (
                                <Link href={`/${role}/courses/${courseId}/sections/${sectionId}/lessons/${id}/edit`}>
                                    <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-background shadow-sm">
                                        <SquarePen className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                            )}
                            {canDelete && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="cursor-pointer hover:bg-destructive/10 hover:text-destructive text-destructive/80" 
                                    onClick={onDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    )}
                    
                    {role === 'user' && !isCompleted && (
                        <Button 
                            size="lg" 
                            className="w-full md:w-auto font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all cursor-pointer" 
                            onClick={onComplete}
                        >
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Mark as Complete
                        </Button>
                    )}
                </div>
            </div>

            <Separator className="my-2" />

            {/* Written Content Area */}
            <div className="px-2 w-full flex justify-center">
                <div className="w-full max-w-4xl prose prose-neutral dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
                    {content ? (
                        parse(content)
                    ) : (
                        <div className="p-8 text-center border-2 border-dashed rounded-xl bg-muted/5">
                            <p className="text-muted-foreground m-0">No additional reading material available for this lesson.</p>
                        </div>
                    )}
                </div>
            </div>

            <Separator className="mt-8 mb-4" />

            {/* Discussion / Comments Section */}
            <div className="px-2 w-full max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Class Discussion</h3>
                </div>
                
                <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-sm">
                    <InfiniteComment lessonId={id} courseId={courseId} />
                </div>
            </div>

        </div>
    );
}