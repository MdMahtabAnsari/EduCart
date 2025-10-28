import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields,twoFactorClient,usernameClient,magicLinkClient,passkeyClient,adminClient,lastLoginMethodClient } from "better-auth/client/plugins";
import {auth} from "@/lib/auth/auth";
import {ac,user,teacher,admin} from "@/lib/auth/permissions";

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(),
        twoFactorClient({
            onTwoFactorRedirect: () => {
                window.location.href = "/auth/two-factor";
            }
        }),
        usernameClient(),
        magicLinkClient(),
        passkeyClient(),
        adminClient({
            ac,
            roles: { user, teacher, admin },
        }),
        lastLoginMethodClient(),
    ],
});