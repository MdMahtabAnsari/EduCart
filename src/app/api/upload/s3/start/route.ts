import { NextRequest, NextResponse } from "next/server";
import { CreateMultipartUploadCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/media/s3";
import { fileNameAndTypeSchema } from "@/lib/schema/media";
import { auth } from "@/lib/auth/auth";

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
  const parsedData = fileNameAndTypeSchema.safeParse(data);
  if (!parsedData.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const { fileName, fileType } = parsedData.data;

  const key = `course/${Date.now()}-${fileName}`;

  const command = new CreateMultipartUploadCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  try {
    const response = await s3Client.send(command);

    return NextResponse.json({
      uploadId: response.UploadId,
      key,
    });
  } catch (error) {
    console.error("Error starting multipart upload:", error);
    return NextResponse.json({ error: "Failed to start multipart upload" }, { status: 500 });
  }
}