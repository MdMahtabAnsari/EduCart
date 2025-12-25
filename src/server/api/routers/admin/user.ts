import { router, adminProcedure } from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { filterUserWithInfiniteScrollSchema } from "@/lib/schema/user";
export const userRouter = router({
    getUsersWithInfiniteScroll: adminProcedure
        .input(filterUserWithInfiniteScrollSchema)
        .query(async ({ input, ctx }) => {
            const prisma = ctx.prisma;
            const { search, cursor, limit, role, isBanned } = input;
            try {
                const limitPlusOne = limit ? limit + 1 : 11;
                const users = await prisma.user.findMany({
                    where: {
                        ...(search
                            && {
                            OR: [
                                { id: { contains: search, mode: 'insensitive' } },
                                { username: { contains: search, mode: 'insensitive' } },
                                { email: { contains: search, mode: 'insensitive' } },
                                { name: { contains: search, mode: 'insensitive' } },
                            ],
                        }),
                        NOT: {
                            id: ctx.session!.user.id
                        }
                        , ...(role && role !== 'all' ? { role } : {}),
                        ...(isBanned === 'all' ? {} : isBanned === 'banned' ? { banned: true } : { banned: false }),


                    },
                    take: limitPlusOne,
                    ...(cursor && { cursor: { id: cursor } }),
                    orderBy: { createdAt: 'desc' },
                    include: {
                        sessions: true
                    }
                });
                let nextCursor: typeof cursor | undefined = undefined;
                if (users.length === limitPlusOne) {
                    const nextItem = users.pop();
                    nextCursor = nextItem!.id;
                }
                return { users, nextCursor };
            } catch (error) {
                throw error;
            }
        }),
});

export type UserRouterOutput = inferRouterOutputs<typeof userRouter>;

