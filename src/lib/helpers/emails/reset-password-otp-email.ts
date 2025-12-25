import {resend} from "@/lib/mail/resend";
import ResetPasswordOTPEmail from "../../../../emails/otp/reset-password-otp-email";


export async function sendResetPasswordOTPEmail({email, otp}: {email: string; otp: string}) {
    try{
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: "Your One-Time Password (OTP)",
            react: ResetPasswordOTPEmail({ email, otp }),
        });
    }catch (error) {
        console.error("Error sending OTP email:", error);
        throw error;
    }
}