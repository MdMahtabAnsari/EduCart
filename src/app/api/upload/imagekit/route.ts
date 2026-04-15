// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server"
import { NextResponse,NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";


export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers,
    })
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin" && session.user.role !== "teacher") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const { token, expire, signature } = getUploadAuthParams({
        privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!, // Never expose this on client side
        publicKey: process.env.IMAGE_KIT_PUBLIC_KEY!,
        // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
        // token: "random-token", // Optional, a unique token for request
    })

    return NextResponse.json({ token, expire, signature, publicKey: process.env.IMAGE_KIT_PUBLIC_KEY })
}