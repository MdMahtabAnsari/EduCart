"use client"
import * as React from "react"
import {
    Award,
    BarChart3,
    BookOpen,
    BookOpenText,
    CreditCard,
    DollarSign,
    Heart,
    HelpCircle,
    LayoutDashboard,
    Settings2,
    Star,
    Users,
    ShoppingCart
} from "lucide-react"
import Link from "next/link"


import {NavMain} from "@/components/nav-main"
// import {NavProjects} from "@/components/nav-projects"
// import {NavSecondary} from "@/components/nav-secondary"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export type Role = "admin" | "teacher" | "user" | string
export type User = {
    name: string
    email: string
    image?: string
}
type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    role: Role
    user: User
}

export const adminNavMain = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
        isActive: true,
        items: [
            {
                title: "Overview",
                url: "/admin/dashboard",
            },
            {
                title: "Analytics",
                url: "/admin/analytics",
            },
        ],
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Users,
        items: [
            {
                title: "All Users",
                url: "/admin/users",
            },
            {
                title: "Teachers",
                url: "/admin/teachers",
            },
            {
                title: "Approvals",
                url: "/admin/approvals",
            },
        ],
    },
    {
        title: "Courses",
        url: "/admin/courses",
        icon: BookOpen,
        items: [
            {
                title: "All Courses",
                url: "/admin/courses",
            },
            {
                title: "Pending Approval",
                url: "/admin/courses/pending",
            },
            {
                title: "Categories",
                url: "/admin/categories",
            },
        ],
    },
    {
        title: "Transactions",
        url: "/admin/transactions",
        icon: DollarSign,
        items: [
            {
                title: "Sales",
                url: "/admin/transactions/sales",
            },
            {
                title: "Payouts",
                url: "/admin/transactions/payouts",
            },
        ],
    },
    {
        title: "Reports",
        url: "/admin/reports",
        icon: BarChart3,
        items: [
            {
                title: "Revenue",
                url: "/admin/reports/revenue",
            },
            {
                title: "Engagement",
                url: "/admin/reports/engagement",
            },
        ],
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings2,
        items: [
            {
                title: "General",
                url: "/admin/settings/general",
            },
            {
                title: "Roles & Permissions",
                url: "/admin/settings/roles",
            },
            {
                title: "Billing",
                url: "/admin/settings/billing",
            },
        ],
    },
];

export const teacherNavMain = [
    {
        title: "Dashboard",
        url: "/teacher/dashboard",
        icon: LayoutDashboard,
        isActive: true,
        items: [
            {
                title: "Overview",
                url: "/teacher/dashboard",
            },
            {
                title: "Performance",
                url: "/teacher/performance",
            },
        ],
    },
    {
        title: "My Courses",
        url: "/teacher/courses",
        icon: BookOpen,
        items: [
            {
                title: "All Courses",
                url: "/teacher/courses",
            },
            {
                title: "Create Course",
                url: "/teacher/courses/create",
            },
            {
                title: "Instructors",
                url: "/teacher/courses/instructors",
            },
        ],
    },
    {
        title: "Students",
        url: "/teacher/students",
        icon: Users,
        items: [
            {
                title: "My Students",
                url: "/teacher/students",
            },
            {
                title: "Messages",
                url: "/teacher/messages",
            },
        ],
    },
    {
        title: "Earnings",
        url: "/teacher/earnings/payouts",
        icon: DollarSign,
        items: [
            {
                title: "Payouts",
                url: "/teacher/earnings/payouts",
            },
            {
                title: "Revenue Report",
                url: "/teacher/earnings/report",
            },
        ],
    },
    {
        title: "Reviews",
        url: "/teacher/reviews",
        icon: Star,
        items: [
            {
                title: "Course Reviews",
                url: "/teacher/reviews",
            },
        ],
    },
    {
        title: "Settings",
        url: "/teacher/settings",
        icon: Settings2,
        items: [
            {
                title: "Profile",
                url: "/teacher/settings/profile",
            },
            {
                title: "Account",
                url: "/teacher/settings/account",
            },
        ],
    },
];

export const userNavMain = [
    {
        title: "Dashboard",
        url: "/user/dashboard",
        icon: LayoutDashboard,
        isActive: true,
        items: [
            {
                title: "Overview",
                url: "/user/dashboard",
            },
            {
                title: "Activity",
                url: "/user/activity",
            },
        ],
    },
    {
        title: "Courses",
        url: "/user/courses",
        icon: BookOpen,
        items: [
            {
                title: "All Courses",
                url: "/user/courses",
            },
            {
                title: "Enrollments",
                url: "/user/courses/enrollments",
            },
            {
                title: "In Progress",
                url: "/user/courses/in-progress",
            },
            {
                title: "Completed",
                url: "/user/courses/completed",
            },
        ],
    },
    {
        title: "Wishlist",
        url: "/user/wishlist",
        icon: Heart,
        items: [
            {
                title: "Saved Courses",
                url: "/user/wishlist",
            },
        ],
    },
    {
        title: "Orders",
        url: "/user/orders",
        icon: CreditCard,
        items: [
            {
                title: "Purchase History",
                url: "/user/orders",
            },
            {
                title: "Invoices",
                url: "/user/orders/invoices",
            },
        ],
    },
    {
        title: "Cart",
        url: "/user/carts",
        icon: ShoppingCart,
        items: [
            {
                title: "My Cart",
                url: "/user/carts",
            },
        ],
    },
    {
        title: "Certificates",
        url: "/user/certificates",
        icon: Award,
        items: [
            {
                title: "All Certificates",
                url: "/user/certificates",
            },
        ],
    },
    {
        title: "Settings",
        url: "/user/settings",
        icon: Settings2,
        items: [
            {
                title: "Profile",
                url: "/user/settings/profile",
            },
            {
                title: "Account",
                url: "/user/settings/account",
            },
        ],
    },
    {
        title: "Help",
        url: "/user/help",
        icon: HelpCircle,
        items: [
            {
                title: "Support",
                url: "/user/help/support",
            },
            {
                title: "FAQs",
                url: "/user/help/faq",
            },
        ],
    },
];

export function AppSidebar({role, user, ...props}: AppSidebarProps) {
    const navItems = role === "admin" ? adminNavMain : role === "teacher" ? teacherNavMain : userNavMain;
    const pannelName = role === "admin" ? "Admin" : role === "teacher" ? "Teacher" : "User";
    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={`/${role}/dashboard`}>
                                <div
                                    className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <BookOpenText className="size-4"/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">EduCart</span>
                                    <span className="text-xs text-muted-foreground">{pannelName} Panel</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems}/>
                {/*<NavProjects projects={data.projects}/>*/}
                {/*<NavSecondary items={data.navSecondary} className="mt-auto"/>*/}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{
                    name: user.name,
                    email: user.email,
                    avatar: user.image || ""
                }}/>
            </SidebarFooter>
        </Sidebar>
    )
}
