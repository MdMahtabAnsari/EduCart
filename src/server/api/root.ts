import { teacherRouter } from "@/server/api/routers/teacher/root";
import { createCallerFactory, router } from "@/server/api/trpc";
import {commonRouter} from "@/server/api/routers/common/root";
import {adminRouter} from "@/server/api/routers/admin/root";
import {userRouter} from "@/server/api/routers/user/root";

export const appRouter = router({
    teacher: teacherRouter,
    common: commonRouter,
    admin: adminRouter,
    user: userRouter,
});


export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
