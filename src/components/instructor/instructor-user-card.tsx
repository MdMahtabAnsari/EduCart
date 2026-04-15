"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InstructorRouterOutputs } from "@/server/api/routers/teacher/instructor";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash, SquarePen, ShieldCheck, Wallet, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditInstructorDialog } from "@/components/dialog/instructor/edit-instructor-dialog";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InstructorUserCardProps {
    instructor: InstructorRouterOutputs["filterCourseInstructorsWithInfiniteScroll"]["instructors"][number];
    permissions: {
        canUpdate: boolean;
        canDelete: boolean;
    };
    onSuccess?: () => void;
    role: string;
}

export function InstructorUserCard({
    instructor,
    permissions,
    onSuccess,
    role,
}: InstructorUserCardProps) {
    const { user, permissions: instructorPermissions, role: instructorRole, status, share, id } = instructor;
    const { name, image, email } = user;
    const { canDelete, canUpdate } = permissions;
    
    const removeMutation = api.teacher.instructor.removeInstructorFromCourse.useMutation();

    const handleRemove = () => {
        toast.promise(
            removeMutation.mutateAsync(
                { id: instructor.id, courseId: instructor.courseId },
                { onSuccess: () => onSuccess?.() }
            ),
            {
                loading: "Removing instructor...",
                success: "Instructor removed successfully",
                error: (err) => `Error: ${err.message}`,
            }
        );
    };

    const isPending = status === "PENDING";

    return (
        <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4 p-5 pb-4">
                <Avatar className="w-12 h-12 border-2 border-background shadow-sm ring-1 ring-border/60">
                    <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                {name}
                            </CardTitle>
                            <Badge 
                                variant={isPending ? "outline" : "secondary"} 
                                className={cn(
                                    "text-[10px] uppercase font-bold tracking-wider px-1.5 h-4 border-none",
                                    isPending ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
                                )}
                            >
                                {status.toLowerCase()}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider px-1.5 h-4 bg-muted/50">
                                {instructorRole.replace("_", " ")}
                            </Badge>
                        </div>

                        {(canDelete || canUpdate) && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <EllipsisVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Instructor Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {canUpdate && !isPending && (
                                        <EditInstructorDialog
                                            values={{
                                                id: id,
                                                permissions: instructorPermissions,
                                                share: Number(share).toFixed(2),
                                                courseId: instructor.courseId,
                                            }}
                                            trigger={
                                                <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                                                    <SquarePen className="w-4 h-4 mr-2" />
                                                    Edit Profile
                                                </DropdownMenuItem>
                                            }
                                            onSuccess={onSuccess}
                                            isOwner={instructorRole === "OWNER"}
                                        />
                                    )}
                                    {canDelete && instructorRole !== "OWNER" && (
                                        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5" onClick={handleRemove}>
                                            <Trash className="w-4 h-4 mr-2" />
                                            Remove
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 opacity-70" />
                        {email}
                    </div>
                </div>
            </CardHeader>

            {role !== "user" && (
                <CardContent className="px-5 pb-5 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-3 rounded-xl border border-border/40">
                        {/* Permissions Sub-section */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                                <ShieldCheck className="w-3 h-3 text-primary" />
                                Rights
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {instructorPermissions.length > 0 ? (
                                    instructorPermissions.map((perm) => (
                                        <span 
                                            key={perm}
                                            className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-background border text-[9px] font-semibold text-foreground/70 uppercase tracking-tighter"
                                        >
                                            {perm.replace("_", " ")}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-muted-foreground italic">No specific rights</span>
                                )}
                            </div>
                        </div>

                        {/* Revenue Share Sub-section */}
                        <div className="space-y-1.5 sm:border-l sm:pl-4 border-border/40">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                                <Wallet className="w-3 h-3 text-primary" />
                                Earnings Share
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-black tabular-nums text-foreground/90">
                                    {Number(share).toFixed(1)}
                                </span>
                                <span className="text-xs font-bold text-muted-foreground">%</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}