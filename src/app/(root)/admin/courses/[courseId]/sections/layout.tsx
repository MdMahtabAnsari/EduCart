import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: 'Section',
    description: 'Section layout for teachers',
};

export default function Layout({
    children,
}: {
    children: ReactNode;
}) {
    return <>{children}</>;
}