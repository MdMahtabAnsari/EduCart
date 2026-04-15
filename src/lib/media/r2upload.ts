import { startMultipartUpload, completeMultipartUpload, createMultipartUpload, uploadUrl, abortMultipartUpload } from "@/lib/api/common/media";

export const uploadToR2 = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    const CHUNK_SIZE = 1024 * 1024 * 10; // 10MB
    const { uploadId, key } = await startMultipartUpload({
        fileName: file.name,
        fileType: file.type,
    });

    const parts = [];
    const totalParts = Math.ceil(file.size / CHUNK_SIZE);
    let uploadedBytes = 0;
    try {
        for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
            const start = (partNumber - 1) * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);
            const { signedUrl } = await createMultipartUpload({
                key,
                uploadId,
                partNumber: partNumber,
            });
            const uploadRes = await uploadUrl(signedUrl, chunk);
            const etag = uploadRes.headers["etag"]!;
            parts.push({
                ETag: etag,
                PartNumber: partNumber,
            });

            // 🔥 Update progress
            uploadedBytes += chunk.size;

            const progress = Math.round((uploadedBytes / file.size) * 100);

            if (onProgress) {
                onProgress(progress);
            }


        }
        const { success } = await completeMultipartUpload({
            key,
            uploadId,
            parts,
        });
        if (!success) {
            throw new Error("Failed to complete multipart upload");
        }
        return key;
    } catch (error) {
        console.error("Error during multipart upload:", error);
        await abortMultipartUpload({
            key,
            uploadId,
        });
        throw error;
    }
}