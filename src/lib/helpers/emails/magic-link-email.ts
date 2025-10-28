import {resend} from "@/lib/mail/resend";
import MagicLinkEmail from "../../../../emails/magic-link-email";


export async function sendMagicLinkEmail({email, url}: {email:string; url: string;}) {
    try{
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: "Your Magic Link",
            react: MagicLinkEmail({url}),
        });
    }catch (error) {
        console.error("Error sending magic link email:", error);
        throw error;
    }
}