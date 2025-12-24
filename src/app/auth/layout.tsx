import { ReactNode } from "react";
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
    return (
        <div className="flex items-center justify-center w-screen h-screen">
            {children}
        </div>
    );
}
