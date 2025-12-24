import {z} from 'zod/v4'
import { MediaType } from "@/generated/prisma/enums";

export const mediaSchema = z.object({
    url:z.url(),
    type:z.enum(MediaType),
})

export const uploadMediaSchema = z.object({
    file:z.instanceof(File),
    folder:z.string().min(1),
})