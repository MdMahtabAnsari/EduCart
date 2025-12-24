"use client"
import { useEffect } from "react"
import posthog from 'posthog-js'
import { authClient } from "@/lib/auth/auth-client"


export function PostHogIdentifyProvider() {
    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (session?.user) {
            posthog.identify(session.user.id, {
                email: session.user.email,
                name: session.user.name,
                role: session.user.role,
            });
        } else {
            posthog.reset();
        }
    }, [session]);
    return null;
}
