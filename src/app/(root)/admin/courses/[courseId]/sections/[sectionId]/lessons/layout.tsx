import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: 'Lesson',
    description: 'Lesson layout for teachers',
};

export default function Layout({
    children,
}: {
    children: ReactNode;
}) {
    return <>{children}</>;
}