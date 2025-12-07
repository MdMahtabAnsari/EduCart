import { ReactNode } from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Auth",
    description: "Authentication pages for EduCart",
};

export default async function Layout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (session?.session) {
        return redirect("/");
    }
    return (
        <div className="flex items-center justify-center w-full h-full">
            {children}
        </div>
    );
}
