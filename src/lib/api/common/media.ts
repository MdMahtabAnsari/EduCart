import { apiClient } from "@/lib/api/api";
import { FileNameFileTypeSchema,MediaMultipartCompleteSchema,MediaMultipartSchema,StartUploadResponseSchema,UploadPartResponseSchema,CompleteUploadResponseSchema, AbortSchema, ImageKitAuthResponseSchema } from "@/lib/schema/media";
import { AxiosResponse } from "axios";


export const startMultipartUpload = async (fileNameAndType:FileNameFileTypeSchema): Promise<StartUploadResponseSchema> => {
    const response = await apiClient.post<StartUploadResponseSchema>("/api/upload/s3/start", fileNameAndType);
    return response.data;
}

export const createMultipartUpload = async (data:MediaMultipartSchema): Promise<UploadPartResponseSchema> => {
    const response = await apiClient.post<UploadPartResponseSchema>("/api/upload/s3/part", data);
    return response.data;
}

export const completeMultipartUpload = async (data:MediaMultipartCompleteSchema): Promise<CompleteUploadResponseSchema> => {
    const response = await apiClient.post<CompleteUploadResponseSchema>("/api/upload/s3/complete", data);
    return response.data;
}

export const uploadUrl = async (url:string,chunk:Blob):Promise<AxiosResponse>=>{
    return await apiClient.put<void>(url, chunk,{
        withCredentials: false,
        withXSRFToken: false,

    });
}

export const abortMultipartUpload = async (data:AbortSchema): Promise<CompleteUploadResponseSchema> => {
    const response = await apiClient.post<CompleteUploadResponseSchema>("/api/upload/s3/abort", data);
    return response.data;
}

export const getImageKitAuthParams = async (): Promise<ImageKitAuthResponseSchema> => {
    const response = await apiClient.get<ImageKitAuthResponseSchema>("/api/upload/imagekit");
    return response.data;
}