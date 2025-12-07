import { router, protectedProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";


export const tagRouter = router({
    getAllTags: protectedProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            return await prisma.tag.findMany();
        } catch (error) {
            throw error;
        }
    }),
});

export type TagRouterOutputs = inferRouterOutputs<typeof tagRouter>;