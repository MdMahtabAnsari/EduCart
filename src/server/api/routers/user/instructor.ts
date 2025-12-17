import { router, userProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { filterInstructorCoursesWithInfiniteScrollSchema } from "@/lib/schema/instructor";

export const instructorRouter = router({
    filterCourseInstructorsWithInfiniteScroll: userProcedure.input(filterInstructorCoursesWithInfiniteScrollSchema).query(async ({ input, ctx }) => {
        const prisma = ctx.prisma;
        const { courseId, cursor, limit } = input;
        try {
            const limitPlusOne = limit ? limit + 1 : 11;
            const instructors = await prisma.courseInstructor.findMany({
                where: {
                    courseId,
                    status: 'APPROVED',
                },
                orderBy: [
                    { share: "desc" },
                    { id: "desc" }   // stable ordering
                ],
                take: limitPlusOne,
                ...(cursor && { cursor: { id: cursor } }),
                include: {
                    user: true
                }
            });
            let nextCursor: typeof cursor | undefined = undefined;
            if (instructors.length > (limitPlusOne - 1)) {
                const nextItem = instructors.pop();
                nextCursor = nextItem!.id;
            }
            return { instructors, nextCursor, permissions: { canCreate:false, canUpdate:false, canDelete:false } };
        } catch (error) {
            throw error;
        }
    }),

});

export type InstructorRouterOutputs = inferRouterOutputs<typeof instructorRouter>;