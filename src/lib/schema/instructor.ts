import {z} from "zod/v4";
import { id } from "@/lib/schema/common";
import { infiniteScroll, pageLimitSchema } from "@/lib/schema/page";
import { InstructorPermission } from "@/generated/prisma/enums";



export const filterInstructorCoursesSchema = z.object({
    courseId: id,
    search: z.string().optional(),
});

export const filterInstructorCoursesWithPageLimitSchema = filterInstructorCoursesSchema.extend({
   pageLimit: pageLimitSchema,
});

export type FilterInstructorCoursesWithPageLimitSchema = z.infer<typeof filterInstructorCoursesWithPageLimitSchema>;
export type FilterInstructorCoursesSchema = z.infer<typeof filterInstructorCoursesSchema>;

export const addInstructorToCourseSchema = z.object({
    courseId: id,
    instructorId: z.string().min(1, "Instructor ID is required"),
    permissions: z.array(z.enum(InstructorPermission)),
});

export const editInstructorInCourseSchema = addInstructorToCourseSchema.omit({instructorId: true, courseId: true}).extend({
    share:z.string().refine((val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 100;
    }, { message: "Share must be a number between 0 and 100" }),
}).partial().extend({
    id: id,
    courseId: id,
});

export type EditInstructorInCourseSchema = z.infer<typeof editInstructorInCourseSchema>;

export type AddInstructorToCourseSchema = z.infer<typeof addInstructorToCourseSchema>;

export const filterInstructorCoursesWithInfiniteScrollSchema = filterInstructorCoursesSchema.extend(infiniteScroll.shape);

export const removeInstructorFromCourseSchema = z.object({
    id: id,
    courseId: id,
});