import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowRight, UserCircle } from "lucide-react";
import Link from "next/link";

import { EnrollmentRouterOutput } from "@/server/api/routers/teacher/enrollment";

interface StudentUserCardProps {
    enrollment: EnrollmentRouterOutput["uniqueStudentsInfiniteScroll"]["enrollments"][number];
}

export function StudentUserCard({ enrollment }: StudentUserCardProps) {
    const { user } = enrollment;
    const { name, image, role, email, id } = user;

    return (
        <Card className="group relative overflow-hidden border-border/50 bg-card hover:shadow-md hover:border-primary/30 transition-all duration-300">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <UserCircle className="w-24 h-24 -mr-8 -mt-8" />
            </div>

            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* Avatar with status ring */}
                    <div className="relative">
                        <Avatar className="w-12 h-12 border-2 border-background shadow-sm ring-1 ring-border/60">
                            <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
                            <AvatarFallback className="bg-linear-to-br from-primary/10 to-primary/5 text-primary font-bold">
                                {name?.[0]?.toUpperCase() ?? "U"}
                            </AvatarFallback>
                        </Avatar>
                        {/* Green online/active indicator dot */}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-bold tracking-tight text-foreground leading-none">
                                {name}
                            </span>
                            {role && (
                                <Badge 
                                    variant="secondary" 
                                    className="text-[10px] uppercase px-1.5 h-4 bg-secondary/60 text-secondary-foreground border-none font-bold tracking-wider"
                                >
                                    {role}
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground font-medium transition-colors group-hover:text-foreground/70">
                            <Mail className="w-3 h-3 mr-1.5 opacity-70" />
                            {email}
                        </div>
                    </div>
                </div>

                {/* Action Area */}
                <div className="flex items-center gap-2">
                    <Link 
                        href={`/teacher/students/${id}`}
                        className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </Card>
    );
}