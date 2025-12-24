import { cloudinary } from "@/lib/media/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadToCloudinary = async ({ file, folder }: { file: File, folder: string }): Promise<UploadApiResponse> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadPromise = new Promise<UploadApiResponse>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder,
                        resource_type: 'auto',
                        chunk_size: 1024 * 1024 * 6 // 6MB
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary Upload Error:", error);
                            reject(error);
                        } else {
                            resolve(result!);
                        }
                    }
                );
                uploadStream.end(buffer);
            }
        );

        return await uploadPromise;
    } catch (error) {
        console.error("Upload to Cloudinary failed:", error);
        throw error;
    }
};