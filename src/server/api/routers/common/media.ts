import { router, protectedProcedure } from "@/server/api/trpc";
import { uploadMediaSchema } from "@/lib/schema/media";
import { uploadToCloudinary } from "@/lib/media/upload";


export const mediaRouter = router({
    uploadMedia: protectedProcedure
        .input(uploadMediaSchema).mutation(async ({ input }) => {
            try {
                const result = await uploadToCloudinary({
                    file: input.file,
                    folder: input.folder,
                });
                return result.secure_url;
            } catch (error) {
                throw error;
            }
        }),
});