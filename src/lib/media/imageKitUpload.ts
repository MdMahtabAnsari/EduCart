import { getImageKitAuthParams } from "@/lib/api/common/media";
import { upload } from "@imagekit/next";

export const uploadToImageKit = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    const { token, expire, signature, publicKey } = await getImageKitAuthParams();
    try {
        const uploadResult = await upload({
            file: file,
            fileName: file.name,
            token,
            expire,
            signature,
            publicKey,
            onProgress: (progress) => {
                if (onProgress) {
                    onProgress((progress.loaded / progress.total) * 100);
                }
            },
        });
        if (!uploadResult.filePath) {
            throw new Error("Upload failed: No file path returned");
        }
        return uploadResult.filePath;
    } catch (error) {
        console.error("Error uploading to ImageKit:", error);
        throw error;
    }
}