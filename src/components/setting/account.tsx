import { UpdateAvatarCard, UpdateNameCard, UpdateUsernameCard, ChangeEmailCard, UpdateFieldCard, AccountsCard } from "@daveyplate/better-auth-ui"
import {auth} from "@/lib/auth/auth"
import { headers } from "next/headers"
export async function Account() {
    const session = await auth.api.getSession({headers: await headers()})
    return (
        <div className="flex flex-col gap-6 w-full mx-auto py-12 px-4">
            <UpdateAvatarCard className="w-full" />
            <UpdateNameCard className="w-full" />
            <UpdateUsernameCard className="w-full" />
            <ChangeEmailCard className="w-full" />
            <UpdateFieldCard
                name="bio"
                label="Bio"
                description="Update your bio"
                placeholder="Enter your current bio"
                className="w-full"
                multiline={true}
                value={session?.user?.bio || ""}
            />
            <AccountsCard className="w-full" />
        </div>
    )
}