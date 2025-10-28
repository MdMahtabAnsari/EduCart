import {z} from 'zod/v4'
import { MediaType } from "@/generated/prisma/enums";

export const mediaSchema = z.object({
    url:z.url(),
    type:z.enum(MediaType),
})