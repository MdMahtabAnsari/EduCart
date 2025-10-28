import {User} from "better-auth";
import {resend} from "@/lib/mail/resend";
import ResetPasswordEmail from "../../../../emails/reset-password-email";


export async function sendResetPasswordEmail({user, url}: {user: User; url: string}) {
    try{
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: user.email,
            subject: "Reset your password",
            react: ResetPasswordEmail({user, url}),
        });
    }catch (error) {
        console.error("Error sending reset password email:", error);
        throw error;
    }
}