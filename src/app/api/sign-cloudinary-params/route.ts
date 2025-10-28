import {cloudinary} from "@/lib/media/cloudinary";
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {paramsToSign} = body;

        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!);

        return NextResponse.json({signature}, {status: 200});
    } catch (error) {
        console.error("Error signing Cloudinary parameters:", error);
        return NextResponse.json({error: "Failed to sign Cloudinary parameters"}, {status: 500});
    }
}