import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseRouterOutputs } from "@/server/api/routers/teacher/course";
import { Media } from "@/components/media/media";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PriceDisplay } from "@/components/price/display-price";
import { Eye } from 'lucide-react';
import Link from "next/link";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";




interface CourseCardProps {
    course: CourseRouterOutputs['getFilteredCourses']['courses'][number];
    role: string;
}

export function CourseCard({ course, role }: CourseCardProps) {
    const {
        title,
        level,
        isFree,
        price,
        offerPrice,
        media,
        published,
        ratings,
    } = course;

    return (
        <Card className="w-full max-w-sm" >
            {/* Media */}
            <div className="relative w-full h-48">
                <AspectRatio ratio={16 / 9} className="overflow-hidden">
                    <Media url={media.url} type={media.type} className="object-cover w-full h-full" alt={title} />
                </AspectRatio>
            </div>

            <CardHeader>
                <CardTitle className="text-lg font-semibold line-clamp-1">{title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{level}</Badge>
                    <Badge variant={published ? "default" : "destructive"}>{published ? "Published" : "Unpublished"}</Badge>
                </div>
            </CardHeader>

            <CardContent>
                {isFree ? (
                    <Badge className="bg-green-500">Free</Badge>
                ) : (
                    <div className="flex items-center gap-2">
                        <PriceDisplay actualPrice={Number(price)} offerPrice={Number(offerPrice)} />
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4 justify-center items-start">
                <Rating value={ratings} readOnly>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <RatingButton className={index < ratings ? "text-green-500" : "text-muted-foreground"} key={index} />
                    ))}
                </Rating>

                <Link href={`/${role}/courses/${course.id}`} className="w-full">
                    <Button className="w-full cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
