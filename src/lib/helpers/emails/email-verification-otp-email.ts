import {resend} from "@/lib/mail/resend";
import EmailVerificationOTPEmail from "../../../../emails/otp/email-verification-otp-email";


export async function sendEmailVerificationOTPEmail({email, otp}: {email: string; otp: string}) {
    try{
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: "Your One-Time Password (OTP)",
            react: EmailVerificationOTPEmail({ email, otp }),
        });
    }catch (error) {
        console.error("Error sending OTP email:", error);
        throw error;
    }
}