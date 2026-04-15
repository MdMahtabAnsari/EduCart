import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/helpers/formatter/date-formatter";
import { Calendar, Clock, Mail, ShieldCheck } from "lucide-react";

import { EnrollmentRouterOutput } from "@/server/api/routers/teacher/enrollment";

interface EnrollmentUserCardProps {
    enrollment: EnrollmentRouterOutput["getEnrollmentsByCourseId"]["enrollments"][number];
}

export function EnrollmentUserCard({ enrollment }: EnrollmentUserCardProps) {
    const { user, createdAt, expiredAt } = enrollment;
    const { name, image, role, email } = user;

    const isExpired = expiredAt ? new Date(expiredAt) < new Date() : false;

    return (
        <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-md hover:border-primary/20 transition-all duration-200">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-5">
                
                {/* User Profile Info */}
                <div className="flex items-center gap-4 flex-1">
                    <Avatar className="w-12 h-12 border-2 border-background shadow-sm ring-1 ring-border/50">
                        <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
                        <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                            {name?.[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                {name}
                            </h3>
                            {role && (
                                <Badge variant="secondary" className="text-[10px] uppercase px-1.5 h-4 bg-secondary/50 font-bold tracking-wider">
                                    {role}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                            <Mail className="w-3 h-3" />
                            {email}
                        </div>
                    </div>
                </div>

                {/* Enrollment Metadata */}
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 text-sm sm:border-l sm:pl-8 border-border/60">
                    
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            Enrolled
                        </span>
                        <span className="font-medium text-foreground/90 tabular-nums">
                            {formatDateTime(createdAt)}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            Expiry
                        </span>
                        <div className="flex items-center gap-2">
                            <span className={`font-medium tabular-nums ${isExpired ? "text-destructive" : "text-foreground/90"}`}>
                                {expiredAt ? formatDateTime(expiredAt) : "Lifetime"}
                            </span>
                            {isExpired && (
                                <Badge variant="destructive" className="h-4 px-1.5 text-[9px] uppercase">
                                    Expired
                                </Badge>
                            )}
                            {!isExpired && expiredAt && (
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            )}
                        </div>
                    </div>

                </div>

                {/* Action Indicator (Optional) */}
                <div className="hidden lg:block">
                     <ShieldCheck className="w-5 h-5 text-muted-foreground/20 group-hover:text-primary/40 transition-colors" />
                </div>
            </div>
        </Card>
    );
}