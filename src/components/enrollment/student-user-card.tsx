import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { EnrollmentRouterOutput } from "@/server/api/routers/teacher/enrollment";

interface StudentUserCardProps {
    enrollment: EnrollmentRouterOutput["uniqueStudentsInfiniteScroll"]["enrollments"][number];
}

export function StudentUserCard({ enrollment }: StudentUserCardProps) {
    const { user } = enrollment;
    const { name, image, role, email } = user;


    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <Avatar className="w-12 h-12 border">
                    <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
                    <AvatarFallback>{name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold tracking-tight">
                            {name}
                        </CardTitle>

                        {role && (
                            <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                                {role}
                            </Badge>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">{email}</p>
                </div>
            </CardHeader>
        </Card>
    );
}
