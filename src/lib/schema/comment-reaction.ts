import {z} from "zod/v4";
import {id} from "@/lib/schema/common";

export const commentReactionSchema = z.object({
    commentId: id,
    lessonId: id,
});