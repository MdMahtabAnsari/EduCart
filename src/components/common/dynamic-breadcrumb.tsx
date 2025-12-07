"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, User, Shield, BookOpen } from "lucide-react"; // Example icons

interface DynamicBreadcrumbProps {
    /** Optional role for prefixing breadcrumb trail (e.g. "admin", "teacher") */
    role?: "admin" | "teacher" | "user";
}

/** Map routes and roles to user-friendly labels and icons */
const labelMap: Record<
    string,
    { label: string; icon?: React.ReactNode }
> = {
    home: { label: "Home", icon: <Home className="w-4 h-4 mr-1" /> },
    admin: { label: "Admin", icon: <Shield className="w-4 h-4 mr-1" /> },
    teacher: { label: "Teacher", icon: <BookOpen className="w-4 h-4 mr-1" /> },
    user: { label: "User", icon: <User className="w-4 h-4 mr-1" /> },
    dashboard: { label: "Dashboard" },
    settings: { label: "Settings" },
    profile: { label: "Profile" },
    reports: { label: "Reports" },
    users: { label: "Users" },
};

export function DynamicBreadcrumb({ role }: DynamicBreadcrumbProps) {
    const pathname = usePathname() ?? "/";
    const segments = pathname.split("/").filter(Boolean);

    // Optional prefix for role
    const prefixSegments = role ? [role, ...segments] : segments;

    if (prefixSegments.length === 0) return null;

    // If only one or two segments, render normally everywhere
    const shouldCondense = prefixSegments.length > 2;

    return (
        <div>
            {/* Full breadcrumb - visible on small+ screens */}
            <div className="hidden sm:block">
                <Breadcrumb>
                    <BreadcrumbList>
                        {prefixSegments.map((segment, index) => {
                            const href = "/" + prefixSegments.slice(0, index + 1).join("/");
                            const isLast = index === prefixSegments.length - 1;

                            const mapEntry = labelMap[segment];
                            const label = mapEntry?.label || decodeURIComponent(segment);
                            const icon = mapEntry?.icon;

                            return (
                                <React.Fragment key={href}>
                                    <BreadcrumbItem>
                                        {!isLast ? (
                                            <BreadcrumbLink asChild>
                                                <Link
                                                    href={href}
                                                    className="flex items-center capitalize text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {icon}
                                                    {label}
                                                </Link>
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage className="flex items-center capitalize font-medium">
                                                {icon}
                                                {label}
                                            </BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>

                                    {/* Place separator outside the BreadcrumbItem so <li> siblings are not nested */}
                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Condensed breadcrumb - visible on extra-small screens */}
            <div className="block sm:hidden">
                {shouldCondense ? (
                    <nav className="flex items-center gap-2 text-sm" aria-label="breadcrumb">
                        {/* First (root) item */}
                        <Link
                            href={"/" + prefixSegments[0]}
                            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                            {labelMap[prefixSegments[0]]?.icon}
                            <span className="capitalize">{labelMap[prefixSegments[0]]?.label ?? decodeURIComponent(prefixSegments[0])}</span>
                        </Link>

                        {/* Ellipsis dropdown using <details> for small screens */}
                        <details className="relative">
                            <summary className="list-none cursor-pointer px-2 py-1 rounded text-muted-foreground hover:bg-gray-100">…</summary>
                            <div className="absolute left-0 mt-2 min-w-[180px] bg-white shadow-md rounded border z-50">
                                <ul className="divide-y">
                                    {prefixSegments.slice(1, -1).map((segment, idx) => {
                                        const realIndex = idx + 1;
                                        const href = "/" + prefixSegments.slice(0, realIndex + 1).join("/");
                                        const label = labelMap[segment]?.label ?? decodeURIComponent(segment);
                                        return (
                                            <li key={href} className="px-3 py-2 hover:bg-gray-50">
                                                <Link href={href} className="block text-sm capitalize text-muted-foreground hover:text-foreground">
                                                    {label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </details>

                        {/* Last item */}
                        <span className="text-sm font-medium capitalize text-foreground">
                            {labelMap[prefixSegments[prefixSegments.length - 1]]?.icon}
                            {labelMap[prefixSegments[prefixSegments.length - 1]]?.label ?? decodeURIComponent(prefixSegments[prefixSegments.length - 1])}
                        </span>
                    </nav>
                ) : (
                    // If not enough segments to condense, show normal compact trail
                    <nav className="flex items-center gap-2 text-sm" aria-label="breadcrumb">
                        {prefixSegments.map((segment, index) => {
                            const href = "/" + prefixSegments.slice(0, index + 1).join("/");
                            const isLast = index === prefixSegments.length - 1;
                            const label = labelMap[segment]?.label ?? decodeURIComponent(segment);
                            return (
                                <React.Fragment key={href}>
                                    {!isLast ? (
                                        <Link href={href} className="text-muted-foreground hover:text-foreground text-sm capitalize">
                                            {label}
                                        </Link>
                                    ) : (
                                        <span className="text-sm font-medium capitalize">{label}</span>
                                    )}
                                    {!isLast && <span className="text-muted-foreground">/</span>}
                                </React.Fragment>
                            );
                        })}
                    </nav>
                )}
            </div>
        </div>
    );
}
