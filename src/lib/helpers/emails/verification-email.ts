import {User} from "better-auth";
import {resend} from "@/lib/mail/resend";
import VerificationEmail from "../../../../emails/verification-email";


export async function sendVerificationEmail({user, url}: {user: User; url: string}) {
    try{
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: user.email,
            subject: "Verify your email address",
            react: VerificationEmail({user, url}),
        });
    }catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
}