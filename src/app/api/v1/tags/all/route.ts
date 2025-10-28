import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.session || !session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (session.user.role !== 'teacher' && session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        if(session.user.banned){
            return NextResponse.json({ error: 'You are banned from performing this action.' }, { status: 403 });
        }
        const tags = await prisma.tag.findMany();
        return NextResponse.json({ tags }, { status: 200 });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}