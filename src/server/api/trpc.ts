import { initTRPC,TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth/auth";
import { type NextRequest } from "next/server";

import superjson from "superjson";
import { ZodError,z } from "zod/v4";

import { prisma } from "@/lib/db/prisma";


export async function createContext(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });
    return { session, prisma };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? z.treeifyError(error.cause) : null,
            },
        };
    },
}

);

// Middleware: Protect routes
const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user || !ctx.session.session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to access this resource" });
    }
    return next({ ctx: { ...ctx } });
});

// Middleware isAdmin
const isAdmin = t.middleware(({ ctx, next }) => {
    if (ctx.session?.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to access this resource" });
    }
    return next({ ctx: { ...ctx } });
});

// Middleware isTeacher
const isTeacher = t.middleware(({ ctx, next }) => {
    if (ctx.session?.user?.role !== "teacher") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to access this resource" });
    }
    return next({ ctx: { ...ctx } });
});

// Middleware isUser
const isUser = t.middleware(({ ctx, next }) => {
    if (ctx.session?.user?.role !== "user") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to access this resource" });
    }
    return next({ ctx: { ...ctx } });
});

// Middleware:isAdmin or Teacher
const isAdminOrTeacher = t.middleware(({ ctx, next }) => {
    if (ctx.session?.user?.role !== "admin" && ctx.session?.user?.role !== "teacher") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to access this resource" });
    }
    return next({ ctx: { ...ctx } });
});

// Middleware: isBanned
const isBanned = t.middleware(({ ctx, next }) => {
    if (ctx.session?.user?.banned) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to access this resource" });
    }
    return next({ ctx: { ...ctx } });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed).use(isBanned);

export const router = t.router;
export const middleware = t.middleware;

export const adminProcedure = protectedProcedure.use(isAdmin).use(isBanned);
export const teacherProcedure = protectedProcedure.use(isTeacher).use(isBanned);
export const userProcedure = protectedProcedure.use(isUser).use(isBanned);
export const adminOrTeacherProcedure = protectedProcedure.use(isAdminOrTeacher).use(isBanned);


export const createCallerFactory = t.createCallerFactory;
