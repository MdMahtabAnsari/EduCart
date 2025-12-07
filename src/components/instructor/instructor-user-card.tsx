"use client";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InstructorRouterOutputs } from "@/server/api/routers/teacher/instructor";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditInstructorDialog } from "@/components/dialog/instructor/edit-instructor-dialog";
import {api} from "@/trpc/react";
import { toast } from "sonner";

interface InstructorUserCardProps {
    instructor: InstructorRouterOutputs["filterCourseInstructorsWithInfiniteScroll"]["instructors"][number];
    permissions: {
        canUpdate: boolean;
        canDelete: boolean;
    };
    onSuccess?: () => void;
}

export function InstructorUserCard({
    instructor,
    permissions,
    onSuccess,
}: InstructorUserCardProps) {
    const { user, permissions: instructorPermissions, role, status, share, id } = instructor;
    const { name, image, email } = user;
    const { canDelete, canUpdate } = permissions;
    const removeMutation = api.teacher.instructor.removeInstructorFromCourse.useMutation();

    const handleRemove = () => {
        toast.promise(
            removeMutation.mutateAsync(
                { id: instructor.id, courseId: instructor.courseId },
                {
                    onSuccess: () => {
                        onSuccess?.();
                    }
                }
            ),
            {
                loading: "Removing instructor...",
                success: "Instructor removed successfully",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center space-x-4 pb-3">
                <Avatar className="w-10 h-10 border">
                    <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col w-full">
                    <div className="flex items-start justify-between gap-2 w-full">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center flex-wrap gap-2">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    {name}
                                </CardTitle>
                                {status && (
                                    <Badge variant="secondary" className="text-xs">
                                        {status}
                                    </Badge>
                                )}
                                {role && (
                                    <Badge variant="outline" className="text-xs">
                                        {role.replace("_", " ")}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">{email}</p>
                        </div>

                        {(canDelete || canUpdate) && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="cursor-pointer">
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {canUpdate && status !== "PENDING" && (
                                        <EditInstructorDialog
                                            values={{
                                                id: id,
                                                permissions: instructorPermissions,
                                                share: Number(share).toFixed(2),
                                                courseId: instructor.courseId,
                                            }}
                                            trigger={
                                                <DropdownMenuItem className="cursor-pointer" onSelect={(e) => {
                                                    e.preventDefault();
                                                }}>
                                                    <SquarePen />
                                                    Edit
                                                </DropdownMenuItem>
                                            }
                                            onSuccess={onSuccess}
                                            isOwner={role==="OWNER"}
                                        />
                                    )}
                                    {canDelete && role !== "OWNER" && (
                                        <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleRemove}>
                                            <Trash />
                                            Remove
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="space-y-3 pt-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground/90">Permissions:</span>
                        <div className="flex flex-wrap gap-2">
                            {instructorPermissions.map((permission) => (
                                <Badge
                                    key={permission}
                                    variant="secondary"
                                    className="text-[10px] px-2 py-0.5 capitalize bg-muted"
                                >
                                    {permission}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground/90">Share:</span>
                        <Badge variant="outline" className="px-2 py-0.5 text-xs font-semibold">
                            {Number(share)}%
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
