import { InstructorRouterOutputs } from "@/server/api/routers/teacher/instructor";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Media } from "@/components/media/media";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface CourseCardProps {
    request: InstructorRouterOutputs["getMyPendingRequestWithCourseDetails"];
    onAccept?: (id:string) => void;
    onReject?: (id:string) => void;
}

export function CourseCard({ request, onAccept, onReject }: CourseCardProps) {
    const { course, permissions, role, status, share,id } = request;
    const { title, media } = course;

    return (
        <Card className="w-full h-fit">
            {/* Header */}
            <CardHeader className="p-5 border-b">
                <CardTitle className="text-lg font-semibold leading-tight">{title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                    Role:{" "}
                    <span className="font-medium text-foreground">
                        {role.replaceAll("_", " ")}
                    </span>
                </CardDescription>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex flex-col sm:flex-row w-full gap-5 p-5">
                {/* Thumbnail */}
                <div className="w-full sm:w-56 rounded-lg overflow-hidden border bg-muted/30 h-fit">
                    <AspectRatio ratio={16 / 9}>
                        <Media
                            url={media.url}
                            type={media.type}
                            alt={title}
                            className="object-cover w-full h-full"
                        />
                    </AspectRatio>
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                    {/* Permissions */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-foreground/90">
                                Permissions:
                            </span>
                        </div>

                        {permissions.length ? (
                            <div className="flex flex-wrap gap-2">
                                {permissions.map((perm) => (
                                    <Badge
                                        key={perm}
                                        variant="secondary"
                                        className="text-xs px-2 py-1"
                                    >
                                        {perm.replaceAll("_", " ")}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                No permissions listed
                            </p>
                        )}
                    </div>

                    <Separator className="my-4" />

                    {/* Share */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-foreground/90">
                            Share:
                        </span>
                        <span className="text-sm text-foreground font-semibold">
                            <Badge variant="outline" className="px-2 py-1">
                                {Number(share).toFixed(2)}%
                            </Badge>
                        </span>
                    </div>

                    <Separator className="my-4" />

                    {/* Status + Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Status */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge
                                variant={status === "PENDING" ? "outline" : "secondary"}
                                className="capitalize"
                            >
                                {status}
                            </Badge>
                        </div>

                        {/* Buttons */}
                        {status === "PENDING" && (
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="destructive"
                                    size="lg"
                                    className="cursor-pointer"
                                    onClick={() => onReject?.(id)}
                                >
                                    <X />
                                    Reject
                                </Button>
                                <Button
                                    size="lg"
                                    className="cursor-pointer"
                                    onClick={() => onAccept?.(id)}
                                >
                                    <Check />
                                    Accept
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
