import {User,Role} from "@/components/app-sidebar"
import {ReactNode} from "react";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

interface SidebarLayoutProps{
    user:User,
    role:Role,
    children:ReactNode
}

export function SidebarLayout({user,role,children}:SidebarLayoutProps) {
    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                    <AppSidebar user={user} role={role}/>
                    <SidebarInset>
                        <div className="flex flex-1 flex-col gap-4 p-4">
                            {children}
                            <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    )
}
