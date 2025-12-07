import { router, teacherProcedure } from "@/server/api/trpc";
import { id } from "@/lib/schema/common";
import { inferRouterOutputs } from "@trpc/server";
import { courseSchemaBackEnd, filteredCoursesSchemaWithPageLimit, editCourseSchemaBackEnd, filterCourseSchemaWithInfiniteScroll } from "@/lib/schema/course";
import { PaginationSchema } from "@/lib/schema/page";
import { TRPCError } from "@trpc/server";
import { startOfMonth, endOfMonth } from "date-fns";
import { searchWithInfiniteScrollSchema } from "@/lib/schema/common";


export const courseRouter = router({
    getCourseById: teacherProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const course = await prisma.course.findFirst({
                where: {
                    id: input,
                    instructor: {
                        some: {
                            userId: ctx.session!.user.id,
                            status: 'APPROVED'
                        }
                    },
                    isActive: true
                },
                include: {
                    categories: {
                        include: { category: true }
                    },
                    tags: {
                        include: { tag: true }
                    },
                    instructor: {
                        where: {
                            status: 'APPROVED'
                        },
                        include: { user: true },
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
            const canCreate = course.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('CREATE'));
            const canUpdate = course.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('UPDATE'));
            const canDelete = course.instructor.some(inst => inst.userId === ctx.session!.user.id && inst.permissions.includes('DELETE'));
            return { ...course, price: Number(course.price), offerPrice: course.offerPrice ? Number(course.offerPrice) : null, enrolments, rating: { average: course.ratings, count: reatingCount }, canBuy: false, canAddToCart: false, permissions: { canCreate, canUpdate, canDelete } };
        } catch (error) {
            throw error;
        }
    }),

    createCourse: teacherProcedure.input(courseSchemaBackEnd).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const media = await prisma.media.create({
                data: {
                    url: input.media.url,
                    type: input.media.type,
                },
            });
            const course = await prisma.$transaction(async (prisma) => {
                const newCourse = await prisma.course.create({
                    data: {
                        title: input.title,
                        description: input.description,
                        mediaId: media.id,
                        published: input.published,
                        price: parseFloat(input.price),
                        level: input.level,
                        offerPrice: input.offerPrice ? parseFloat(input.offerPrice) : null,
                        isFree: input.isFree,
                    }

                });
                await prisma.courseInstructor.create({
                    data: {
                        courseId: newCourse.id,
                        userId: ctx.session!.user.id,
                        permissions: ['CREATE', 'DELETE', 'UPDATE'],
                        status: 'APPROVED',
                        role: 'OWNER',
                        share: 100.00
                    },
                });
                await prisma.courseCategory.createMany({
                    data: input.categories.map((categoryId) => ({
                        courseId: newCourse.id,
                        categoryId,
                    })),
                });
                if (input.tags && input.tags.length > 0) {
                    await prisma.courseTag.createMany({
                        data: input.tags.map((tagId) => ({
                            courseId: newCourse.id,
                            tagId,
                        })),
                    });
                }

                await prisma.courseLanguage.createMany({
                    data: input.language.map((languageId) => ({
                        courseId: newCourse.id,
                        languageId,
                    })),
                });
                return newCourse;
            });
            return course;
        } catch (error) {
            throw error;
        }
    }),

    getFilteredCourses: teacherProcedure.input(filteredCoursesSchemaWithPageLimit).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { pageLimit, search, categories, tags, languages, free, level, priceRange, ratings } = input;
        const { page, limit } = pageLimit;
        const minPrice = priceRange[0];
        const maxPrice = priceRange[1];
        try {
            const courseCount = await prisma.course.count({
                where: {
                    instructor: {
                        some: {
                            userId: ctx.session!.user.id,
                            status: 'APPROVED'
                        }
                    },
                    isActive: true,
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
                    instructor: {
                        some: {
                            userId: ctx.session!.user.id,
                            status: 'APPROVED',
                        }
                    },
                    isActive: true,
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
    editCourse: teacherProcedure.input(editCourseSchemaBackEnd).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const { id, media, tags, categories, language, ...data } = input;
            const course = await prisma.$transaction(async (prisma) => {
                const updatedCourse = await prisma.course.update({
                    where: {
                        id,
                        instructor: {
                            some: {
                                userId: ctx.session!.user.id,
                                status: 'APPROVED',
                                permissions: {
                                    has: 'UPDATE'
                                }
                            }
                        },
                        isActive: true

                    },
                    data: {
                        ...data,
                    }

                });
                if (media) {
                    const newMedia = await prisma.media.create({
                        data: {
                            url: media.url,
                            type: media.type,
                        }
                    });
                    await prisma.course.update({
                        where: { id: updatedCourse.id },
                        data: { mediaId: newMedia.id }
                    });
                }
                if (categories && categories.length > 0) {
                    await prisma.courseCategory.deleteMany({
                        where: { courseId: updatedCourse.id }
                    });
                    await prisma.courseCategory.createMany({
                        data: categories.map((categoryId) => ({
                            courseId: updatedCourse.id,
                            categoryId: categoryId,
                        })),
                    });
                }
                if (tags && tags.length > 0) {
                    await prisma.courseTag.deleteMany({
                        where: { courseId: updatedCourse.id }
                    });
                    await prisma.courseTag.createMany({
                        data: tags.map((tagId) => ({
                            courseId: updatedCourse.id,
                            tagId: tagId,
                        })),
                    });
                }
                if (language && language.length > 0) {
                    await prisma.courseLanguage.deleteMany({
                        where: { courseId: updatedCourse.id }
                    });
                    await prisma.courseLanguage.createMany({
                        data: language.map((languageId) => ({
                            courseId: updatedCourse.id,
                            languageId: languageId,
                        })),
                    });
                }
                return updatedCourse;
            });
            return course;
        }
        catch (error) {
            throw error;
        }
    }),
    deleteCourse: teacherProcedure.input(id).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            const deletedCourse = await prisma.course.update({
                where: {
                    id: input,
                    instructor: {
                        some: {
                            userId: ctx.session!.user.id,
                            permissions: {
                                has: 'DELETE'
                            },
                            status: 'APPROVED'
                        }
                    }
                },
                data: { isActive: false }
            });
            return deletedCourse;
        }
        catch (error) {
            throw error;
        }
    }),

    getMonthlyCourses: teacherProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const now = new Date();
            const startMonth = startOfMonth(now);
            const endMonth = endOfMonth(now);
            const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const [lastMonthCourses, thisMonthCourses] = await Promise.all([
                prisma.course.count({
                    where: {
                        instructor: {
                            some: {
                                userId: ctx.session!.user.id,
                                status: 'APPROVED'
                            }
                        },
                        createdAt: {
                            gte: lastMonthStart,
                            lte: lastMonthEnd
                        }
                    }
                }),
                prisma.course.count({
                    where: {
                        instructor: {
                            some: {
                                userId: ctx.session!.user.id,
                                status: 'APPROVED'
                            }
                        },
                        createdAt: {
                            gte: startMonth,
                            lte: endMonth
                        }
                    }
                })
            ]);

            const percentageChange = lastMonthCourses > 0
                ? ((thisMonthCourses - lastMonthCourses) / lastMonthCourses) * 100
                : (thisMonthCourses > 0 ? 100 : 0);

            return {
                thisMonthCourses,
                percentageChange: percentageChange,
            };
        }
        catch (error) {
            throw error;
        }
    }),

    filterCoursesWithInfiniteScroll: teacherProcedure.input(filterCourseSchemaWithInfiniteScroll).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { cursor, limit, search, categories, tags, languages, free, level, priceRange, ratings } = input;
        const minPrice = priceRange[0];
        const maxPrice = priceRange[1];
        try {
            const limitPlusOne = limit ? limit + 1 : 11;
            const courses = await prisma.course.findMany({
                where: {
                    instructor: {
                        some: {
                            userId: ctx.session!.user.id,
                            status: 'APPROVED',
                        }
                    },
                    isActive: true,
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

    courseWithIdAndTitleWithInfiniteScroll: teacherProcedure.input(searchWithInfiniteScrollSchema).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { cursor, limit, search } = input;
        try {
            const limitPlusOne = limit ? limit + 1 : 11;
            const courses = await prisma.course.findMany({
                where: {
                    instructor: {
                        some: {
                            userId: ctx.session!.user.id,
                            status: 'APPROVED',
                        }
                    },
                    isActive: true,
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
                                id: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            }
                        ],
                    }),
                },
                ...(cursor && { cursor: { id: cursor } }),
                take: limitPlusOne,
                select: {
                    id: true,
                    title: true,
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
