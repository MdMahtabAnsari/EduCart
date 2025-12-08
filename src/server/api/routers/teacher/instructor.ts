import { router, teacherProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { filterInstructorCoursesWithPageLimitSchema, addInstructorToCourseSchema, filterInstructorCoursesWithInfiniteScrollSchema, editInstructorInCourseSchema, removeInstructorFromCourseSchema,filterNonAddedCourseInstructorsWithInfiniteScrollSchema } from "@/lib/schema/instructor";
import { PaginationSchema } from "@/lib/schema/page";
import { TRPCError } from "@trpc/server";
import { id } from "@/lib/schema/common";

export const instructorRouter = router({
    filterNonAddedCourseInstructors: teacherProcedure.input(filterInstructorCoursesWithPageLimitSchema).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { courseId, search, pageLimit } = input;
        const { page, limit } = pageLimit;
        try {
            const CourseInstructor = await prisma.user.count({
                where: {
                    NOT: [
                        {
                            courseInstructors: {
                                some: {
                                    courseId,
                                    status: {
                                        in: ["APPROVED", "PENDING"],
                                    },
                                },
                            },
                        },
                    ],
                    role: 'teacher',
                    banned: false,
                    ... (search && {
                        OR: [
                            {
                                name: {
                                    contains: search,
                                    mode: "insensitive"
                                },
                            },
                            {
                                email: {
                                    contains: search,
                                    mode: "insensitive"
                                },
                            },
                            {
                                username: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            }
                        ],
                    })
                }
            });
            const skip = (page - 1) * limit;

            const instructors = await prisma.user.findMany({
                where: {
                    NOT: [
                        {
                            courseInstructors: {
                                some: {
                                    courseId,
                                    status: {
                                        in: ["APPROVED", "PENDING"],
                                    },
                                },
                            },
                        },
                    ],
                    role: 'teacher',
                    banned: false,
                    ... (search && {
                        OR: [
                            {
                                name: {
                                    contains: search,
                                    mode: "insensitive"
                                },
                            },
                            {
                                email: {
                                    contains: search,
                                    mode: "insensitive"
                                },
                            },
                            {
                                username: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            }
                        ],
                    })
                },
                skip,
                take: limit,
            });

            const pagination: PaginationSchema = {
                currentPage: page,
                limit: limit,
                totalPages: Math.ceil(CourseInstructor / limit),
                totalItems: CourseInstructor
            };

            return { instructors, pagination };;
        }
        catch (error) {
            throw error;
        }
    }),
    addInstructorToCourse: teacherProcedure.input(addInstructorToCourseSchema).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { courseId, instructorId, permissions } = input;
        try {
            const isOwner = await prisma.courseInstructor.findFirst({
                where: {
                    courseId,
                    userId: ctx.session!.user.id,
                    role: 'OWNER',
                    status: 'APPROVED'
                }
            });
            if (!isOwner) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only course owners can add instructors",
                });
            }
            const isExisting = await prisma.courseInstructor.findFirst({
                where: {
                    courseId,
                    userId: instructorId,
                }
            });
            if (isExisting && (isExisting.status === 'APPROVED' || isExisting.status === 'PENDING')) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Instructor is already added to the course",
                });
            }
            else if (isExisting && (isExisting.status === 'REJECTED' || isExisting.status === 'REMOVED')) {
                const updatedInstructor = await prisma.courseInstructor.update({
                    where: {
                        id: isExisting.id,
                    },
                    data: {
                        status: 'PENDING',
                        permissions,
                        share: 0.00,
                    },
                });
                return updatedInstructor;
            }
            const newInstructor = await prisma.courseInstructor.create({
                data: {
                    courseId,
                    userId: instructorId,
                    status: 'PENDING',
                    permissions,
                },
            });
            return newInstructor;
        }
        catch (error) {
            throw error;
        }
    }),

    filterNonAddedCourseInstructorsWithInfiniteScroll: teacherProcedure.input(filterNonAddedCourseInstructorsWithInfiniteScrollSchema).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { courseId, search, cursor, limit } = input;
        try {
            const limitPlusOne = limit ? limit + 1 : 11;
            const instructors = await prisma.user.findMany({
                where: {
                    NOT: [
                        {
                            courseInstructors: {
                                some: {
                                    courseId,
                                    status: {
                                        in: ["APPROVED", "PENDING"],
                                    },
                                },
                            },
                        },
                    ],
                    role: 'teacher',
                    banned: false,
                    ... (search && {
                        OR: [
                            {
                                name: {
                                    contains: search,
                                    mode: "insensitive"
                                },
                            },
                            {
                                email: {
                                    contains: search,
                                    mode: "insensitive"
                                },
                            },
                            {
                                username: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            }
                        ],
                    })
                },
                take: limitPlusOne,
                ...(cursor && { cursor: { id: cursor } }),
            });
            let nextCursor: typeof cursor | undefined = undefined;
            if (instructors.length > (limitPlusOne - 1)) {
                const nextItem = instructors.pop(); // return the last item from the array
                nextCursor = nextItem!.id;
            }
            return { instructors, nextCursor };
        } catch (error) {
            throw error;
        }
    }),

    getInstructorById: teacherProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        try {
            return await prisma.courseInstructor.findUnique({
                where: {
                    id: input
                },
                include: {
                    user: true
                }
            });
        } catch (error) {
            throw error;
        }
    }),
    filterCourseInstructorsWithInfiniteScroll: teacherProcedure.input(filterInstructorCoursesWithInfiniteScrollSchema).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { courseId, search, cursor, limit,permissions, status, shareRange } = input;
        const min = shareRange[0];
        const max = shareRange[1];
        try {
            const isOwnerOrMember = await prisma.courseInstructor.findFirst({
                where: {
                    courseId,
                    userId: ctx.session!.user.id,
                    status: 'APPROVED',
                }
            });
            if(!isOwnerOrMember){
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are not an instructor of this course",
                });
            }
            const limitPlusOne = limit ? limit + 1 : 11;
            const instructors = await prisma.courseInstructor.findMany({
                where: {
                    courseId,
                    status: {
                        in: status === 'ALL' ? ['PENDING','APPROVED','REJECTED'] : [status]
                    },
                    ... (permissions && permissions.length > 0 && {
                        permissions: {
                            hasSome: permissions
                        }
                    }),
                    share: {
                        gte: min,
                        lte: max
                    },
                    user: {
                        ... (search && {
                            OR: [
                                {
                                    name: {
                                        contains: search,
                                        mode: "insensitive"
                                    },
                                },
                                {
                                    email: {
                                        contains: search,
                                        mode: "insensitive"
                                    },
                                },
                                {
                                    username: {
                                        contains: search,
                                        mode: "insensitive"
                                    }
                                }
                            ],
                        }),
                    }
                },
                orderBy: {
                    share: 'desc'
                },
                take: limitPlusOne,
                ...(cursor && { cursor: { id: cursor } }),
                include: {
                    user: true
                }
            });
            let canCreate = false;
            let canUpdate = false;
            let canDelete = false;
            if (isOwnerOrMember.role === 'OWNER') {
                canCreate = true;
                canUpdate = true;
                canDelete = true;
            }
            let nextCursor: typeof cursor | undefined = undefined;
            if (instructors.length > (limitPlusOne - 1)) {
                const nextItem = instructors.pop();
                nextCursor = nextItem!.id;
            }
            return { instructors, nextCursor, permissions: { canCreate, canUpdate, canDelete } };
        } catch (error) {
            throw error;
        }
    }),
    getOccupiedShareInCourse: teacherProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const courseId = input;
        try {
            const result = await prisma.courseInstructor.aggregate({
                where: {
                    courseId,
                    status: 'APPROVED'
                },
                _sum: {
                    share: true
                }
            });
            return result._sum.share ?? 0;
        }
        catch (error) {
            throw error;
        }
    }),
    editInstructorInCourse: teacherProcedure.input(editInstructorInCourseSchema).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { id, courseId, ...data } = input;
        try {
            const isOwner = await prisma.courseInstructor.findFirst({
                where: {
                    courseId,
                    userId: ctx.session!.user.id,
                    role: 'OWNER',
                    status: 'APPROVED'
                }
            });
            if (!isOwner) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only course owners can edit instructor details",
                });
            }
            if (data.share !== undefined) {
                const occupiedShare = await prisma.courseInstructor.aggregate({
                    where: {
                        courseId,
                        status: 'APPROVED',
                        NOT: {
                            id: id
                        }
                    },
                    _sum: {
                        share: true
                    }
                });
                const totalShare = Number((occupiedShare._sum.share ?? 0)) + parseFloat(data.share);
                if (totalShare > 100) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Total share exceeds 100%. Currently occupied share is ${occupiedShare._sum.share ?? 0}%.`,
                    });
                }
            }
            return await prisma.courseInstructor.update({
                where: { id },
                data,
            });
        } catch (error) {
            throw error;
        }
    }),
    removeInstructorFromCourse: teacherProcedure.input(removeInstructorFromCourseSchema).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { id, courseId } = input;
        try {
            const isOwner = await prisma.courseInstructor.findFirst({
                where: {
                    courseId,
                    userId: ctx.session!.user.id,
                    role: 'OWNER',
                    status: 'APPROVED'
                }
            });
            if (!isOwner) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only course owners can remove instructors",
                });
            }
            return await prisma.courseInstructor.update({
                where: { id },
                data: {
                    status: 'REMOVED'
                }
            });
        } catch (error) {
            throw error;
        }
    }),

    getMyPendingRequestWithCourseDetails: teacherProcedure.input(id).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const courseId = input;
        try {
            const request = await prisma.courseInstructor.findFirst({
                where: {
                    courseId,
                    userId: ctx.session!.user.id,
                    status: 'PENDING'
                },
                include: {
                    course:{
                        include: {
                            media: true
                        }
                    }
                }
            });
            if(!request){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No pending request found for this course",
                });
            }
            return request;
        } catch (error) {
            throw error;
        }
    }),

    acceptRequest: teacherProcedure.input(id).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const requestId = input;
        try {
            const request = await prisma.courseInstructor.findFirst({
                where: {
                    id: requestId,
                    userId: ctx.session!.user.id,
                    status: 'PENDING'
                }
            });
            if (!request) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No pending request found",
                });
            }
            const updatedRequest = await prisma.courseInstructor.update({
                where: {
                    id: requestId
                },
                data: {
                    status: 'APPROVED'
                }
            });
            return updatedRequest;
        } catch (error) {
            throw error;
        }
    }),
    rejectRequest: teacherProcedure.input(id).mutation(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const requestId = input;
        try {
            const request = await prisma.courseInstructor.findFirst({
                where: {
                    id: requestId,
                    userId: ctx.session!.user.id,
                    status: 'PENDING'
                }
            });
            if (!request) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No pending request found",
                });
            }
            const updatedRequest = await prisma.courseInstructor.update({
                where: {
                    id: requestId
                },
                data: {
                    status: 'REJECTED'
                }
            });
            return updatedRequest;
        }
        catch (error) {
            throw error;
        }
    }),

});

export type InstructorRouterOutputs = inferRouterOutputs<typeof instructorRouter>;