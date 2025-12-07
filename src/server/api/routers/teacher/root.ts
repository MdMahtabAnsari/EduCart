import { router} from "@/server/api/trpc";
import {courseRouter} from "@/server/api/routers/teacher/course";
import {sectionRouter} from "@/server/api/routers/teacher/section";
import {lessonRouter} from "@/server/api/routers/teacher/lesson";
import { enrollmentRouter } from "@/server/api/routers/teacher/enrollment";
import { chartRouter } from "@/server/api/routers/teacher/chart";
import {orderRouter} from "@/server/api/routers/teacher/order";
import { instructorRouter } from "@/server/api/routers/teacher/instructor";

export const teacherRouter = router({
    course: courseRouter,
    section: sectionRouter,
    lesson: lessonRouter,
    enrollment: enrollmentRouter,
    chart: chartRouter,
    order: orderRouter,
    instructor: instructorRouter,
});