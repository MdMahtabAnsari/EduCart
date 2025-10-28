import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { courseSchemaBackEnd } from "@/lib/schema/course";
import {fromError} from "zod-validation-error";

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.session || !session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (session.user.role !== 'teacher') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        if(session.user.banned){
            return NextResponse.json({ error: 'You are banned from performing this action.' }, { status: 403 });
        }
        const body = await request.json();
        const parsedData = courseSchemaBackEnd.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json({ error: fromError(parsedData.error).message }, { status: 400 });
        }
        const courseData = parsedData.data;
        const media = await prisma.media.create({
            data: {
                url: courseData.media.url,
                type: courseData.media.type,
            },
        });
        const course = await prisma.course.create({
            data: {
                title: courseData.title,
                description: courseData.description,
                mediaId: media.id,
                published: courseData.published,
                price: parseFloat(courseData.price),
                level: courseData.level,
                isActive: courseData.isActive,
                offerPrice: courseData.offerPrice ? parseFloat(courseData.offerPrice) : null,
                isFree: courseData.isFree,
                language: courseData.language,
                currency: courseData.currency,
            },
        });
        if(courseData.instructor.length > 0){
            await prisma.courseInstructor.createMany({
                data: courseData.instructor.map((instructorId) => ({
                    courseId: course.id,
                    userId: instructorId,
                })),
            });
        }
        await prisma.courseCategory.createMany({
            data: courseData.categories.map((categoryId) => ({
                courseId: course.id,
                categoryId,
            })),
        });
        if(courseData.tags && courseData.tags.length > 0){
            await prisma.courseTag.createMany({
                data: courseData.tags.map((tagId) => ({
                    courseId: course.id,
                    tagId,
                })),
            });
        }
        await prisma.courseInstructor.create({
            data: {
                courseId: course.id,
                userId: session.user.id,
            },
        });
        const createdCourse = await prisma.course.findUnique({
            where: { id: course.id },
            include: {
                categories:{
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
        return NextResponse.json({ course: createdCourse }, { status: 201 });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}