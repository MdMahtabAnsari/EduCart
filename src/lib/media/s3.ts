import {S3Client} from "@aws-sdk/client-s3";


export const s3Client = new S3Client({
    region: "auto",
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY!,
        secretAccessKey: process.env.CLOUDFLARE_SECRET!,
    },
    endpoint: process.env.CLOUDFLARE_ENDPOINT!,
});
