import { tagRouter } from "@/server/api/routers/common/tag";
import { categoryRouter } from "@/server/api/routers/common/category";
import {languageRouter} from "@/server/api/routers/common/language";
import { teacherRouter } from "@/server/api/routers/common/teacher";
import {commentRouter} from "@/server/api/routers/common/comment";
import {commentReactionRouter} from "@/server/api/routers/common/comment-reaction";
import { reviewRouter } from "@/server/api/routers/common/review";
import { router } from "@/server/api/trpc";


export const commonRouter = router({
    tag: tagRouter,
    category: categoryRouter,
    language: languageRouter,
    teacher: teacherRouter,
    comment: commentRouter,
    commentReaction: commentReactionRouter,
    review: reviewRouter,
});