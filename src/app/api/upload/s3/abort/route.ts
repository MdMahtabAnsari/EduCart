import { NextRequest, NextResponse } from "next/server";
import { AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/media/s3";
import { auth } from "@/lib/auth/auth";
import { abortSchema } from "@/lib/schema/media";

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
    const parsedData = abortSchema.safeParse(data);
    if (!parsedData.success) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const { key, uploadId } = parsedData.data;

    const command = new AbortMultipartUploadCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        UploadId: uploadId,
    });
    try {

        await s3Client.send(command);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error aborting multipart upload:", error);
        return NextResponse.json({ error: "Failed to abort multipart upload" }, { status: 500 });
    }
}