import { NextRequest, NextResponse } from "next/server";
import { UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/media/s3";
import { auth } from "@/lib/auth/auth";
import { mediaMultipartSchema } from "@/lib/schema/media";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers,
    })
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin" && session.user.role !== "teacher") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const data = await req.json();
    const parsedData = mediaMultipartSchema.safeParse(data);
    if (!parsedData.success) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const { key, uploadId, partNumber } = parsedData.data;

    const command = new UploadPartCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
    });
    try {
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60,
        });

        return NextResponse.json({ signedUrl });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
    }
}