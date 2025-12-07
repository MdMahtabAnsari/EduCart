import { router, protectedProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";


export const categoryRouter = router({
    getAllCategories: protectedProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            return await prisma.category.findMany();
        } catch (error) {
            throw error;
        }
    }),
});

export type CategoryRouterOutputs = inferRouterOutputs<typeof categoryRouter>;
