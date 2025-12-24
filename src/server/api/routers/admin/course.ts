import { router, adminProcedure } from "@/server/api/trpc";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { filterCourseSchemaWithInfiniteScroll } from "@/lib/schema/course";
import { id } from "@/lib/schema/common";

export const courseRouter = router({
    filterCoursesWithInfiniteScroll: adminProcedure.input(filterCourseSchemaWithInfiniteScroll).query(async ({ input, ctx }) => {
            const prisma = ctx.prisma;
            const { cursor, limit, search, categories, tags, languages, free, level, priceRange, ratings } = input;
            const minPrice = priceRange[0];
            const maxPrice = priceRange[1];
            try {
                const limitPlusOne = limit ? limit + 1 : 11;
                const courses = await prisma.course.findMany({
                    where: {
                        ...(search && {
                            OR: [
                                {
                                    title: {
                                        contains: search,
                                        mode: "insensitive"
                                    },
                                },
                                {
                                    description: {
                                        contains: search,
                                        mode: "insensitive"
                                    },
                                },
                                {
                                },
                            ],
                        }),
                        ...(categories.length > 0 && {
                            categories: {
                                some: { categoryId: { in: categories } }
                            }
                        }),
                        ...(tags.length > 0 && {
                            tags: {
                                some: { tagId: { in: tags } }
                            }
                        }),
                        ...(languages.length > 0 && {
                            languages: {
                                some: { languageId: { in: languages } }
                            }
                        }),
                        isFree: free === 'ALL' ? undefined : free === 'FREE' ? true : false,
                        level: level === 'ALL' ? undefined : level,
                        price: { gte: minPrice, lte: maxPrice },
                        offerPrice: { gte: minPrice, lte: maxPrice },
                        ratings: { gte: ratings },
                    },
                    ...(cursor && { cursor: { id: cursor } }),
                    take: limitPlusOne,
                    include: {
                        media: true,
                    },
                });
                let nextCursor: typeof cursor | undefined = undefined;
                if (courses.length > (limitPlusOne - 1)) {
                    const nextItem = courses.pop(); // return the last item from the array
                    nextCursor = nextItem!.id;
                }
                return { courses, nextCursor };
            } catch (error) {
                throw error;
            }
        }),
        getCourseById: adminProcedure.input(id).query(async ({ input, ctx }) => {
                const prisma = ctx.prisma;
                try {
                    const course = await prisma.course.findFirst({
                        where: {
                            id: input,
                        },
                        include: {
                            categories: {
                                include: { category: true }
                            },
                            tags: {
                                include: { tag: true }
                            },
                            media: true,
                            languages: {
                                include: { language: true }
                            }
                        },
                    });
                    if (!course) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: "Course not found",
                        });
                    }
                    const reatingCount = await prisma.review.count({
                        where: {
                            courseId: input,
                        },
                    });
                    const enrolments = await prisma.enrollment.count({
                        where: {
                            courseId: input,
                        },
                    });
                    const instrucorCount = await prisma.courseInstructor.count({
                        where: {
                            courseId: input,
                            status: 'APPROVED'
                        },
                    });
                    return { ...course, price: Number(course.price), offerPrice: course.offerPrice ? Number(course.offerPrice) : null, enrolments, rating: { average: course.ratings, count: reatingCount }, canBuy: false, canAddToCart: false, permissions: { canCreate:true, canUpdate:true, canDelete:true },instructors: instrucorCount };
                } catch (error) {
                    throw error;
                }
            }),
});

export type CourseRouterOutputs = inferRouterOutputs<typeof courseRouter>;