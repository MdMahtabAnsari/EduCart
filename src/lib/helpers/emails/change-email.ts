import {User} from "better-auth";
import {resend} from "@/lib/mail/resend";
import ChangeEmailEmail from "../../../../emails/change-email-email";


export async function sendChangeEmail({user, url,newEmail}: {user: User; url: string; newEmail: string}) {
    try{
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: user.email,
            subject: "Confirm your email change",
            react: ChangeEmailEmail({user, url, newEmail}),
        });
    }catch (error) {
        console.error("Error sending email change confirmation:", error);
        throw error;
    }
}