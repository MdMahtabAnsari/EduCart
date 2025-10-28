import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // treat root and auth subroutes (e.g. /auth/signin) as public, but NOT the plain /auth
    const isRoot = pathname === "/";
    const isAuthPublic = pathname.startsWith("/auth/"); // allows /auth/signin, /auth/register, etc.
    const isApiAuth = pathname.startsWith("/api/auth");
    const isCloudinary = pathname.startsWith("/api/sign-cloudinary-params");
    const isNextInternals = pathname.startsWith("/_next/");
    const isFavicon = pathname === "/favicon.ico";

    const isPublic = isRoot || isAuthPublic || isApiAuth || isCloudinary || isNextInternals || isFavicon;
    if (isPublic) return NextResponse.next();

    const session = await auth.api.getSession({
        headers: req.headers,
    });

    // adjust to your auth shape; most libs return either null or an object with user
    if (!session?.session || !session.user) {
        const signInUrl = new URL("/auth/signin", req.url);
        signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
        return NextResponse.redirect(signInUrl);
    }

    // if user navigates to /auth (exact), redirect them to their role dashboard
    if (pathname.startsWith("/auth")) {
        const role = session.user.role;
        if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        if (role === "teacher") return NextResponse.redirect(new URL("/teacher/dashboard", req.url));
        return NextResponse.redirect(new URL("/user/dashboard", req.url));
    }

    // role-based protection for sections
    const role = session.user.role;
    if (pathname.startsWith("/admin")) {
        if (role === "admin") return NextResponse.next();
        return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
    }
    if (pathname.startsWith("/teacher")) {
        if (role === "teacher") return NextResponse.next();
        return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
    }
    if (pathname.startsWith("/user")) {
        if (role === "user") return NextResponse.next();
        return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
    }

    // default fallback
    return NextResponse.next();
}

export const config = {
    // Match all routes except the specific API and internals we want to skip
    matcher: ["/((?!api/auth|api/sign-cloudinary-params|_next|favicon.ico).*)"],
};
