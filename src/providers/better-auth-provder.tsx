"use client"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { authClient } from "@/lib/auth/auth-client"
import Image from "next/image"
import { api } from "@/trpc/react"

export function BetterAuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const uploadMediaMutation = api.common.media.uploadMedia.useMutation()
    const { data: session } = authClient.useSession()

    return (
        <AuthUIProvider
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            onSessionChange={() => {
                // Clear router cache (protected routes)
                router.refresh()
            }}
            social={{
                providers: ['google', 'github', 'discord']
            }}
            multiSession={true}
            magicLink={true}
            passkey={true}
            Link={Link}
            optimistic={true}
            nameRequired={true}
            emailOTP={true}
            emailVerification={true}
            changeEmail={true}
            redirectTo="/user/dashboard"
            apiKey={true}
            twoFactor={['otp']}
            avatar={{
                upload: async (file) => {
                    const result = await uploadMediaMutation.mutateAsync({
                        folder: "educart/profile-images",
                        file: file,
                    });
                    return result;
                },
                Image: (props) => {
                    return (
                        <Image
                            src={props.src || "/default-avatar.png"}
                            alt={props.alt || "User Avatar"}
                            width={40}
                            height={40}
                            className={`${props.className} rounded-full w-full h-full object-cover`}
                        />
                    )
                }
            }}

            additionalFields={{
                bio: {
                    label: 'Bio',
                    placeholder: "Write about you",
                    description: "Write about you in details",
                    required: false,
                    type: "string"

                },
                username: {
                    label: 'Username',
                    placeholder: "Your unique username",
                    description: "This will be your unique username",
                    required: true,
                    type: "string"
                }
            }}
            account={
                {
                    basePath: `/${session?.user?.role || "user"}/settings`,
                    fields: ["image", "bio", "name", "email", "username", "role"],
                }
            }
        >
            {children}
        </AuthUIProvider>
    )
}