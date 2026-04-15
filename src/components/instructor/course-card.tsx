import { InstructorRouterOutputs } from "@/server/api/routers/teacher/instructor";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Media } from "@/components/media/media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Shield, Wallet, UserCircle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCardProps {
    request: InstructorRouterOutputs["getMyPendingRequestWithCourseDetails"];
    onAccept?: (id: string) => void;
    onReject?: (id: string) => void;
}

export function CourseCard({ request, onAccept, onReject }: CourseCardProps) {
    const { course, permissions, role, status, share, id } = request;
    const { title, media } = course;

    const isPending = status === "PENDING";

    return (
        <Card className={cn(
            "group overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4",
            isPending ? "border-l-amber-500" : "border-l-primary"
        )}>
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    {/* Visual Side */}
                    <div className="w-full md:w-72 relative">
                        <AspectRatio ratio={16 / 9} className="bg-muted">
                            <Media
                                url={media.url}
                                type={media.type}
                                alt={title}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                        </AspectRatio>
                        <div className="absolute top-2 left-2">
                            <Badge className={cn(
                                "shadow-sm backdrop-blur-md border-none",
                                isPending ? "bg-amber-500/90 text-white" : "bg-primary/90 text-primary-foreground"
                            )}>
                                {status}
                            </Badge>
                        </div>
                    </div>

                    {/* Info Side */}
                    <div className="flex-1 p-6 flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                                        {title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <UserCircle className="w-4 h-4" />
                                        <span>Invited as <span className="font-semibold text-foreground capitalize">{role.replace("_", " ")}</span></span>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                                {/* Revenue Share */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                        <Wallet className="w-3 h-3 text-primary" />
                                        Revenue Share
                                    </div>
                                    <p className="text-lg font-bold tabular-nums">
                                        {Number(share).toFixed(1)}%
                                    </p>
                                </div>

                                {/* Permissions */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                        <Shield className="w-3 h-3 text-primary" />
                                        Access Level
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {permissions.slice(0, 2).map((perm) => (
                                            <Badge key={perm} variant="outline" className="text-[9px] bg-background capitalize px-1.5 py-0">
                                                {perm.replace("_", " ").toLowerCase()}
                                            </Badge>
                                        ))}
                                        {permissions.length > 2 && (
                                            <span className="text-[10px] text-muted-foreground font-medium">+{permissions.length - 2} more</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        {isPending && (
                            <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                                <Button
                                    variant="ghost"
                                    className="flex-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors group/reject"
                                    onClick={() => onReject?.(id)}
                                >
                                    <X className="w-4 h-4 mr-2 transition-transform group-hover/reject:rotate-90" />
                                    Decline
                                </Button>
                                <Button
                                    className="flex-2 cursor-pointer shadow-md shadow-primary/20"
                                    onClick={() => onAccept?.(id)}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Accept Invitation
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}