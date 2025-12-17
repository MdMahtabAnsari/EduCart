import { router} from "@/server/api/trpc";
import {reviewRouter} from "@/server/api/routers/user/review";
import {courseRouter} from "@/server/api/routers/user/course";
import {paymentRouter} from "@/server/api/routers/user/payment";
import { orderRouter } from "@/server/api/routers/user/order";
import {sectionRouter} from "@/server/api/routers/user/section";
import {lessonRouter} from "@/server/api/routers/user/lesson";
import { cartRouter } from "@/server/api/routers/user/cart";
import {instructorRouter} from "@/server/api/routers/user/instructor";
import {enrollmentRouter} from "@/server/api/routers/user/enrollment";
import {chartRouter} from "@/server/api/routers/user/chart"


export const userRouter = router({
    review: reviewRouter,
    course: courseRouter,
    payment: paymentRouter,
    order: orderRouter,
    section: sectionRouter,
    lesson: lessonRouter,
    cart: cartRouter,
    instructor: instructorRouter,
    enrollment: enrollmentRouter,
    chart: chartRouter,
});