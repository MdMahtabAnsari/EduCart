"use client";
import { CourseRouterOutputs } from "@/server/api/routers/teacher/course";
import { Media } from "@/components/media/media";
import { CategoryBadges } from "@/components/category/category-badges";
import { TagBadges } from "@/components/tag/tag-badges";
import parse from "html-react-parser";
import { SquarePen, Eye, Plus, ShoppingBasket, Trash, UserCheck, ShoppingCart } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { PriceDisplay } from "@/components/price/display-price";
import ISO6391 from 'iso-639-1';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from '@/trpc/react';
import { toast } from "sonner";
import { InfiniteReview } from "@/components/review/infinite-review";

interface CourseDetailsProps {
    course: CourseRouterOutputs["getCourseById"];
    role: string;
}

export function CourseDetails({ course, role }: CourseDetailsProps) {
    const categories = course.categories.map(c => ({ id: c.categoryId, name: c.category.name }));
    const tags = course.tags.map(t => ({ id: t.tagId, name: t.tag.name }));
    const instructors = course.instructor?.map(i => ({ id: i.user.id, name: i.user.name, image: i.user.image }));
    const languageNames = course.languages.map(l => ISO6391.getName(l.language.code)).filter(name => name);
    const router = useRouter();
    const deleteCourseMutation = api.teacher.course.deleteCourse.useMutation();
    const createOrderMutation = api.user.order.createOrder.useMutation();
    const addToCartMutation = api.user.cart.addToCart.useMutation();
    const { permissions } = course;
    const { canDelete, canUpdate, canCreate } = permissions;

    const deleteCourse = async (courseId: string) => {
        toast.promise(
            deleteCourseMutation.mutateAsync(courseId, {
                onSuccess: () => {
                    router.push(`/${role}/courses`);
                }
            }),
            {
                loading: "Deleting course...",
                success: "Course deleted successfully",
                error: (err) => `Error deleting course: ${err.message}`,
            }
        );
    };

    const createOrder = async (courseId: string) => {
        toast.promise(
            createOrderMutation.mutateAsync({ courseIds: [courseId] }, {
                onSuccess: (data) => {
                    if (Number(data.totalAmount) > 0) {
                        router.push(`/${role}/orders/${data.id}/payments`);
                    } else {
                        router.push(`/${role}/courses/enrollments/${courseId}`);
                    }
                },
            }),
            {
                loading: "Creating order...",
                success: "Order created successfully",
                error: (err) => `Error creating order: ${err.message}`,
            }
        );
    }

    const addToCart = async (courseId: string) => {
        toast.promise(
            addToCartMutation.mutateAsync(courseId, {
                onSuccess: () => {
                    router.refresh();
                }
            }),
            {
                loading: "Adding to cart...",
                success: "Course added to cart successfully",
                error: (err) => `Error adding to cart: ${err.message}`,
            }
        );
    };

    return (

        <div className="max-w-5xl mx-auto rounded-lg shadow-sm overflow-hidden">
            <div className="md:flex">
                <div className="md:w-1/3 p-4 flex flex-col gap-4">
                    <div className="w-full rounded overflow-hidden ">
                        {course.media ? (
                            <AspectRatio ratio={16 / 9}>
                                <Media url={course.media.url} type={course.media.type} className="w-full h-full object-cover rounded-md" />
                            </AspectRatio>
                        ) : (
                            <div className="w-full h-48 flex items-center justify-center text-muted-foreground">No media</div>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Instructors</div>
                            <div className="font-semibold">
                                {instructors && instructors.length > 0
                                    ? instructors.map(i => i.name).join(", ")
                                    : "N/A"}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-xs text-muted-foreground">Enrolments</div>
                            <div className={`text-lg font-semibold ${(role === 'admin' || role === 'teacher') && "flex gap-2 items-center"}`}>{course.enrolments}
                                {(role === "teacher" || role === "admin") && (
                                    <Link href={`/${role}/courses/${course.id}/enrollments`}>
                                        <Button className="cursor-pointer" variant="ghost" size='icon-sm'>
                                            <UserCheck />
                                        </Button>
                                    </Link>)}
                            </div>

                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Level</span>
                            <span className="font-medium">{course.level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground">Language</div>
                                <div className="font-semibold">
                                    {languageNames.length > 0
                                        ? languageNames.join(", ")
                                        : "N/A"}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Published</span>
                            <span className={`font-medium ${course.published ? "text-green-600" : "text-orange-500"}`}>{course.published ? "Yes" : "No"}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                        <div className="text-muted-foreground text-xs">Price</div>
                        {
                            course.isFree ? (
                                <span className="text-lg font-semibold text-green-600">Free</span>
                            ) : (
                                <PriceDisplay actualPrice={course.price} offerPrice={Number(course.offerPrice)} />
                            )
                        }


                    </div>
                </div>

                <div className="md:w-2/3 p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4 sm:flex-row flex-col">
                        <div>
                            <h2 className="text-2xl font-bold">{course.title}</h2>
                            <div className="text-sm text-muted-foreground mt-1">Created: {course.createdAt.toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                            })}</div>
                        </div>

                    </div>

                    <div className="flex flex-wrap flex-col gap-3 justify-center items-start">
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground">Categories</div>
                            <div className="font-semibold">
                                <CategoryBadges categories={categories} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">Tags</span>
                            <TagBadges tags={tags} />
                        </div>
                    </div>

                    <Separator />

                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        {course.description ? parse(course.description) : <p className="text-muted-foreground">No description provided.</p>}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <Rating value={course.rating.average} readOnly>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <RatingButton className={index < course.rating.average ? "text-green-500" : "text-muted-foreground"} key={index} />
                                ))}
                            </Rating>
                            <div className="text-md text-muted-foreground">{course.rating.count} reviews</div>

                        </div>
                        <div>
                            <div className="text-muted-foreground">Last updated</div>
                            <div className="font-medium">{course.updatedAt.toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                            })}</div>
                        </div>

                    </div>
                    <div className="w-full flex gap-4 flex-wrap">
                        <Link href={`/${role}/courses/${course.id}/sections`} >
                            <Button className="cursor-pointer" size='lg'>
                                <Eye />
                                Sections
                            </Button>
                        </Link>
                        {canCreate && (
                            <Link href={`/${role}/courses/${course.id}/sections/create`}>
                                <Button className="cursor-pointer" size='lg'>
                                    <Plus />
                                    Add Section
                                </Button>
                            </Link>
                        )}
                        {canUpdate && (
                            <Link href={`/${role}/courses/${course.id}/edit`}>
                                <Button className="cursor-pointer" size='lg'>
                                    <SquarePen />
                                    Edit Course
                                </Button>
                            </Link>
                        )}

                        {course.canBuy && (
                            <Button className="cursor-pointer" size='lg' onClick={() => createOrder(course.id)}>
                                <ShoppingBasket />
                                Purchase
                            </Button>
                        )}
                        {course.canAddToCart && (
                            <Button className="cursor-pointer" size='lg' onClick={() => addToCart(course.id)}>
                                <ShoppingCart />
                                Add to Cart
                            </Button>
                        )}
                        {
                            canDelete && (
                                <Button variant="destructive" className="cursor-pointer" size='lg' onClick={() => deleteCourse(course.id)}>
                                    <Trash />
                                    Delete Course
                                </Button>
                            )
                        }
                    </div>
                </div>
            </div>
            <Separator />
            <InfiniteReview courseId={course.id} role={role} />

        </div>

    );
}