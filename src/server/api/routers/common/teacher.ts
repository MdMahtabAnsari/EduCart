import { router, protectedProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";

export const teacherRouter = router({
    getTeachersIdAndName: protectedProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const teachers = await prisma.user.findMany({
                where: {
                    role: "teacher", banned: false,
                    NOT: { id: ctx.session!.user.id }
                },

                select: { id: true, name: true },
            });
            return teachers;
        } catch (error) {
            throw error;
        }
    }),
});

export type TeacherRouterOutputs = inferRouterOutputs<typeof teacherRouter>;