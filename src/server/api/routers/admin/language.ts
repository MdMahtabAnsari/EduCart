import { router, adminProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";
import ISO6391 from 'iso-639-1';

export const languageRouter = router({
    createLanguages: adminProcedure.mutation(async ({ ctx }) => {
        const prisma = ctx.prisma;
        try {
            const languages = ISO6391.getAllCodes().map(code => ({ code }));
            await prisma.language.createMany({
                data: languages,
            });
        } catch (error) {
            throw error;
        }
    }),
});
export type LanguageRouterOutputs = inferRouterOutputs<typeof languageRouter>;