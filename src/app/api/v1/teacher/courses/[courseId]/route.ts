import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { fromError } from "zod-validation-error";
import { id } from "@/lib/schema/common";

export async function GET(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.session || !session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (session.user.role !== 'teacher') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        if (session.user.banned) {
            return NextResponse.json({ error: 'You are banned from performing this action.' }, { status: 403 });
        }
        const { courseId } = await params;
        const parsedId = id.safeParse(courseId);
        if (!parsedId.success) {
            return NextResponse.json({ error: fromError(parsedId.error).message }, { status: 400 });
        }
        const course = await prisma.course.findUnique({
            where: { id: parsedId.data },
            include: {
                categories: {
                    include: { category: true }
                },
                tags: {
                    include: { tag: true }
                },
                instructor: {
                    include: { user: true },
                },
                media: true,
            },
        });
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }
        return NextResponse.json({ course }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}