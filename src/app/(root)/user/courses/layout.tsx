import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: 'Courses',
    description: 'Courses layout for users',
};

export default function Layout({
    children,
}: {
    children: ReactNode;
}) {
    return <>{children}</>;
}