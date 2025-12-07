import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/prisma"
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendChangeEmail, sendOTPEmail, sendMagicLinkEmail, } from "@/lib/helpers/emails";
import { twoFactor, username, magicLink, admin as adminPlugin, lastLoginMethod, openAPI } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
import { passkey } from "@better-auth/passkey"
import { username as usernameSchema } from "@/lib/schema/common";
import { admin, user, teacher, ac } from "@/lib/auth/permissions";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            bio: {
                type: "string",
                input: true,
                required: false,
            }
        },
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, newEmail, url }) => {
                await sendChangeEmail({ user, url, newEmail });
            }
        },
    },
    emailAndPassword: {
        requireEmailVerification: true,
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            await sendResetPasswordEmail({ user, url });
        }

    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail({ user, url });
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        afterEmailVerification: async (user) => {
            await sendWelcomeEmail({ user });
        }

    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }
    },
    account: {
        accountLinking: {
            enabled: true,
        }
    },
    plugins: [
        twoFactor({
            issuer: "EduCart",
            otpOptions: {
                sendOTP: async ({ user, otp }) => {
                    await sendOTPEmail({ user, otp });
                }
            }
        }),
        username({
            usernameValidator: (username) => {
                return usernameSchema.safeParse(username).success;
            }
        }),
        magicLink({
            sendMagicLink: async ({ email, url }) => {
                await sendMagicLinkEmail({ email, url });
            }
        }),
        passkey(),
        adminPlugin({
            defaultRole: "user",
            ac,
            roles: {
                admin,
                teacher,
                user
            }
        }),
        lastLoginMethod(),
        openAPI(),
        nextCookies(),

    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 //seconds
        }
    },
    secret: process.env.BETTER_AUTH_SECRET!,
});