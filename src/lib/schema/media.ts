import {z} from 'zod/v4'
import { MediaType } from "@/generated/prisma/enums";

export const mediaSchema = z.object({
    url:z.string().min(1),
    type:z.enum(MediaType),
})

export const uploadMediaSchema = z.object({
    file:z.instanceof(File),
    folder:z.string().min(1),
})


export const fileNameAndTypeSchema = z.object({
    fileName:z.string().min(1),
    fileType:z.string().min(1),
})

export const abortSchema = z.object({
    uploadId:z.string().min(1),
    key:z.string().min(1),
})

export type AbortSchema = z.infer<typeof abortSchema>


export const mediaMultipartSchema = z.object({
    key:z.string().min(1),
    uploadId:z.string().min(1),
    partNumber:z.number().int().positive(),
})

export const mediaMultipartCompleteSchema = z.object({
    key:z.string().min(1),
    uploadId:z.string().min(1),
    parts:z.array(z.object({
        ETag:z.string().min(1),
        PartNumber:z.number().int().positive(),
    })).min(1),
})

export type FileNameFileTypeSchema = z.infer<typeof fileNameAndTypeSchema>
export type MediaMultipartSchema = z.infer<typeof mediaMultipartSchema>
export type MediaMultipartCompleteSchema = z.infer<typeof mediaMultipartCompleteSchema>


export const startUploadResponseSchema = z.object({
    uploadId:z.string(),
    key:z.string(),
})


export type StartUploadResponseSchema = z.infer<typeof startUploadResponseSchema>


export const uploadPartResponseSchema = z.object({
    signedUrl:z.string(),
})

export type UploadPartResponseSchema = z.infer<typeof uploadPartResponseSchema>

export const completeUploadResponseSchema = z.object({
    success:z.boolean(),
})

export type CompleteUploadResponseSchema = z.infer<typeof completeUploadResponseSchema>


export const imageKitAuthResponseSchema = z.object({
    token:z.string(),
    expire:z.number(),
    signature:z.string(),
    publicKey:z.string(),
})

export type ImageKitAuthResponseSchema = z.infer<typeof imageKitAuthResponseSchema>;