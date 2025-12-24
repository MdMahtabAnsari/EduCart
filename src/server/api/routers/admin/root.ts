import { router } from "@/server/api/trpc";
import { languageRouter } from "@/server/api/routers/admin/language";
import { chartRouter } from "@/server/api/routers/admin/chart";
import { courseRouter } from "@/server/api/routers/admin/course";
import { orderRouter } from "@/server/api/routers/admin/order";
import { enrollmentRouter } from "@/server/api/routers/admin/enrollment";
import { userRouter } from "@/server/api/routers/admin/user";

export const adminRouter = router({
    language: languageRouter,
    chart: chartRouter,
    course: courseRouter,
    order: orderRouter,
    enrollment: enrollmentRouter,
    user: userRouter,
});