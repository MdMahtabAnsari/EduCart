import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseRouterOutputs } from "@/server/api/routers/teacher/course";
import { Media } from "@/components/media/imagekit/media";
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
        <Card className="group flex flex-col w-full max-w-sm h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/60 bg-card">
            {/* Media Section */}
            <div className="relative w-full overflow-hidden bg-muted">
                <AspectRatio ratio={16 / 9} className="overflow-hidden">
                    <Media 
                        url={media.url} 
                        type={media.type} 
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
                        alt={title} 
                    />
                </AspectRatio>
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <CardHeader className="p-5 pb-2">
                <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="rounded-full px-3 font-medium shadow-none bg-secondary/60 hover:bg-secondary text-secondary-foreground">
                        {level}
                    </Badge>
                    <Badge variant={published ? "outline" : "destructive"} className="rounded-full px-3 shadow-none">
                        {published ? "Published" : "Draft"}
                    </Badge>
                </div>
                <CardTitle className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </CardTitle>
            </CardHeader>

            {/* Content Section (Grows to keep cards uniform in a grid) */}
            <CardContent className="p-5 pt-2 grow flex flex-col justify-end">
                <div className="flex flex-col gap-4 mt-auto">
                    {/* Ratings */}
                    <div className="flex items-center justify-between">
                        <Rating value={ratings} readOnly className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <RatingButton 
                                    key={index}
                                    className={
                                        index < ratings 
                                            ? "text-emerald-500 fill-emerald-500" 
                                            : "text-muted-foreground/30"
                                    } 
                                />
                            ))}
                        </Rating>
                        <span className="text-xs font-medium text-muted-foreground">
                            {ratings > 0 ? `${ratings.toFixed(1)} / 5.0` : "No ratings"}
                        </span>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center pt-4 border-t border-border/50">
                        {isFree ? (
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-sm rounded-full shadow-sm">
                                Free
                            </Badge>
                        ) : (
                            <div className="flex items-center gap-2">
                                <PriceDisplay actualPrice={Number(price)} offerPrice={Number(offerPrice)} />
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
                <Link href={`/${role}/courses/${course.id}`} className="w-full">
                    <Button className="w-full rounded-full transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:bg-primary/90">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}