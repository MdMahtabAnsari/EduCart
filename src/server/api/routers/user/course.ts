import { router, userProcedure } from "@/server/api/trpc";
import { id } from "@/lib/schema/common";
import { inferRouterOutputs } from "@trpc/server";
import { filteredCoursesSchemaWithPageLimit, filterCourseSchemaWithInfiniteScroll } from "@/lib/schema/course";
import { PaginationSchema } from "@/lib/schema/page";
import { TRPCError } from "@trpc/server";

export const courseRouter = router({
    getCourseById: userProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const course = await prisma.course.findFirst({
                where: {
                    id: input,
                    isActive: true,
                    published: true,
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
            const isEnrolled = await prisma.enrollment.findFirst({
                where: {
                    courseId: input,
                    userId: ctx.session!.user.id,
                    status: {
                        in: ['ACTIVE', 'COMPLETED']
                    }
                },
            });
            const instrucorCount = await prisma.courseInstructor.count({
                where: {
                    courseId: input,
                    status: 'APPROVED'
                },
            });
            const isInCart = await prisma.cartItem.findFirst({
                where: {
                    courseId: input,
                    cart: {
                        userId: ctx.session!.user.id,
                    },
                },
            });
            const canBuy = isEnrolled ? false : true;
            const canAddToCart = isInCart ? false : true;
            return { ...course, price: Number(course.price), offerPrice: course.offerPrice ? Number(course.offerPrice) : null, enrolments, rating: { average: course.ratings, count: reatingCount }, canBuy: canBuy, canAddToCart: canAddToCart, permissions: { canCreate: false, canUpdate: false, canDelete: false }, instructors: instrucorCount };
        } catch (error) {
            throw error;
        }
    }),

    getFilteredCourses: userProcedure.input(filteredCoursesSchemaWithPageLimit).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { pageLimit, search, categories, tags, languages, free, level, priceRange, ratings, enrolled, instructors } = input;
        const { page, limit } = pageLimit;
        const minPrice = priceRange[0];
        const maxPrice = priceRange[1];
        try {
            const courseCount = await prisma.course.count({
                where: {
                    ...(instructors.length > 0 && {
                        instructor: {
                            some: {
                                userId: { in: instructors },
                            }
                        }
                    }),
                    ...(search ? {
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
                    } : {}),
                    enrollments: enrolled ? {
                        some: {
                            userId: ctx.session!.user.id,
                        }
                    } : {
                        none: {
                            userId: ctx.session!.user.id,
                        }
                    },
                    categories: categories.length > 0 ? {
                        some: { categoryId: { in: categories } }
                    } : undefined,
                    tags: tags.length > 0 ? {
                        some: { tagId: { in: tags } }
                    } : undefined,
                    languages: languages.length > 0 ? {
                        some: { languageId: { in: languages } }
                    } : undefined,
                    isFree: free === 'ALL' ? undefined : free === 'FREE' ? true : false,
                    level: level === 'ALL' ? undefined : level,
                    price: { gte: minPrice, lte: maxPrice },
                    ratings: { gte: ratings },
                    isActive: true,
                    published: true,
                },
            });
            if (courseCount === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No courses found",
                });
            }

            const skip = (page - 1) * limit;

            const courses = await prisma.course.findMany({
                where: {
                    instructor: instructors.length > 0 ? {
                        some: {
                            userId: { in: instructors },
                        }
                    } : undefined,
                    ...(search ? {
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
                    } : {}),
                    enrollments: enrolled ? {
                        some: {
                            userId: ctx.session!.user.id,
                        }
                    } : {
                        none: {
                            userId: ctx.session!.user.id,
                        }
                    },
                    categories: categories.length > 0 ? {
                        some: { categoryId: { in: categories } }
                    } : undefined,
                    tags: tags.length > 0 ? {
                        some: { tagId: { in: tags } }
                    } : undefined,
                    languages: languages.length > 0 ? {
                        some: { languageId: { in: languages } }
                    } : undefined,
                    isFree: free === 'ALL' ? undefined : free === 'FREE' ? true : false,
                    level: level === 'ALL' ? undefined : level,
                    price: { gte: minPrice, lte: maxPrice },
                    ratings: { gte: ratings },
                    isActive: true,
                    published: true,
                },
                skip,
                take: limit,
                include: {
                    media: true,
                },
            });

            const pagination: PaginationSchema = {
                currentPage: page,
                limit: limit,
                totalPages: Math.ceil(courseCount / limit),
                totalItems: courseCount
            };
            return { courses, pagination };
        } catch (error) {
            throw error;
        }
    }),
    filterCoursesWithInfiniteScroll: userProcedure.input(filterCourseSchemaWithInfiniteScroll).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { cursor, limit, search, categories, tags, languages, free, level, priceRange, ratings, enrolled, instructors } = input;
        const minPrice = priceRange[0];
        const maxPrice = priceRange[1];
        try {
            const limitPlusOne = limit ? limit + 1 : 11;

            const courses = await prisma.course.findMany({
                where: {
                    ...(instructors.length > 0 && {
                        instructor: {
                            some: {
                                userId: { in: instructors },
                            }
                        }
                    }),
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
                    enrollments: enrolled ? {
                        some: {
                            userId: ctx.session!.user.id,
                        }
                    } : {
                        none: {
                            userId: ctx.session!.user.id,
                        }
                    },
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
                    offerPrice:{ gte: minPrice, lte: maxPrice },
                    ratings: { gte: ratings },
                    isActive: true,
                    published: true,
                },
                cursor: cursor ? { id: cursor } : undefined,
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

});

export type CourseRouterOutputs = inferRouterOutputs<typeof courseRouter>;
