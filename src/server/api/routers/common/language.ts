import { router, protectedProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";


export const languageRouter = router({
    getAllLanguages: protectedProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            return await prisma.language.findMany();
        } catch (error) {
            throw error;
        }
    }),
});

export type LanguageRouterOutputs = inferRouterOutputs<typeof languageRouter>;