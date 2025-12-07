"use client";
import { LessonRouterOutputs } from "@/server/api/routers/teacher/lesson";
import { Media } from "@/components/media/media";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import parse from "html-react-parser";
import { InfiniteComment } from "@/components/comment/infinite-comment";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash, SquarePen, TableOfContents } from 'lucide-react';
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { SectionSheet } from "@/components/section/section-sheet";

interface LessonDetailsProps {
  lesson: LessonRouterOutputs["getLessonById"];
  role: string;
}

export function LessonDetails({ lesson, role }: LessonDetailsProps) {
  const {lesson:lessonData,permissions} = lesson;
  const { canDelete, canUpdate } = permissions;
  const { title, content, media, order, isPreview, section, sectionId,progress, id } = lessonData;
  const { courseId } = section;
  const isCompleted = progress.find(p => p.completed);
  const router = useRouter();
  const deleteLessonMutation = api.teacher.lesson.deleteLesson.useMutation();
  const completeLessonMutation = api.user.lesson.makeLessonComplete.useMutation();
  const onDelete = () => {
    toast.promise(
      deleteLessonMutation.mutateAsync(id, {
        onSuccess: () => {
          router.push(`/${role}/courses/${courseId}/sections`);
        },
      }),
      {
        loading: "Deleting lesson...",
        success: "Lesson deleted successfully",
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
        loading: "Marking lesson as complete...",
        success: "Lesson marked as complete",
        error: (err) => `Error: ${err.message}`,
      }
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-3">

      <Card className="w-full h-fit border-none shadow-none bg-transparent">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2 mt-2">
            <SectionSheet
              trigger={<Button className="cursor-pointer" size="sm">
                <TableOfContents />
                Sections
              </Button>}
              courseId={courseId}
              role={role}
            />
          </div>
          <div className="flex items-center justify-between">
            <CardTitle>
              Lesson {order}: {title}
            </CardTitle>
            {isPreview && <Badge variant="secondary">Preview</Badge>}
          </div>

        </CardHeader>

        <CardContent className="space-y-4">

          <AspectRatio ratio={16 / 9}>
            <Media url={media.url} type={media.type} />
          </AspectRatio>
          <div className="flex items-center">
            {
              canUpdate && (
                <Link href={`/${role}/courses/${courseId}/sections/${sectionId}/lessons/${id}/edit`}>
                  <Button className="cursor-pointer mr-2">
                    <SquarePen />
                    Edit Lesson
                  </Button>
                </Link>
              )
            }
            {
              canDelete && (
                <Button variant="destructive" className="cursor-pointer" onClick={onDelete}>
                  <Trash />
                  Delete Lesson
                </Button>
              )
            }
            {
              role==='user' && !isCompleted && (
                <Button className="cursor-pointer" onClick={onComplete}>
                  Mark as Complete
                </Button>
              )
            }
          </div>
          <Separator />

          <div className="prose prose-neutral dark:prose-invert overflow-hidden">
            {content ? parse(content) : <p className="text-muted-foreground">No content available.</p>}
          </div>

        </CardContent>

      </Card>
      <Separator />
      <InfiniteComment lessonId={id} courseId={courseId} />
    </div>
  );
}