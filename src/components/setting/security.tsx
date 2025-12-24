import { ChangePasswordCard, ProvidersCard, SessionsCard,  PasskeysCard, TwoFactorCard } from "@daveyplate/better-auth-ui"
export async function Security() {
    return (
        <div className="flex flex-col gap-6 w-full mx-auto py-12 px-4">
            <ChangePasswordCard className="w-full" />
            <ProvidersCard className="w-full" />
            <TwoFactorCard className="w-full" />
            <PasskeysCard className="w-full" />
            <SessionsCard className="w-full" />
        </div>
    )
}