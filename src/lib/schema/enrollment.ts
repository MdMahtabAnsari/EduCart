import {z} from "zod/v4";
import { pageLimitSchema } from "@/lib/schema/page";
import { id } from "@/lib/schema/common";
import {EnrollmentStatus} from "@/generated/prisma/enums";
import { infiniteScroll } from "@/lib/schema/page";

export const filteredEnrollmentsSchema = z.object({
    courseId: id,
    search: z.string().optional(),
    status: z.enum([...Object.values(EnrollmentStatus),'ALL'])
});

export const fiteredEnrollmentSchmeaWithOptionalCourseId = filteredEnrollmentsSchema.extend({
    courseId: id.optional(),
});


export const filteredEnrollmentsSchemaWithInfiniteScroll = filteredEnrollmentsSchema.extend(infiniteScroll.shape);

export type FilteredEnrollmentsSchema = z.infer<typeof filteredEnrollmentsSchema>;

export const filteredEnrollmentsSchemaWithPageLimit = filteredEnrollmentsSchema.extend({
    pageLimit: pageLimitSchema,
});

export const studentsWithInfiniteScrollSchema = fiteredEnrollmentSchmeaWithOptionalCourseId.extend(infiniteScroll.shape);


export type FiteredEnrollmentSchmeaWithOptionalCourseId = z.infer<typeof fiteredEnrollmentSchmeaWithOptionalCourseId>;