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

    return (
        <div >
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
    );
}
