import { ReactNode } from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarLayout } from "@/components/common/sidebar-layout";


export default async function Layout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.session || !session?.user) {
        return redirect("/auth/signin");
    }
    const user = session.user;
    const role = user.role;
    return (
        <SidebarLayout role={role || 'admin'} user={{ name: user.name, email: user.email, image: user?.image || '' }}>
            <div className="w-full h-full flex justify-center items">
            {children}
            </div>
        </SidebarLayout>
    );
}
