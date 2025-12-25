import {resend} from "@/lib/mail/resend";
import SignInOTPEmail from "../../../../emails/otp/sign-in-otp-email";


export async function sendSignInOTPEmail({email, otp}: {email: string; otp: string}) {
    try{
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: "Your One-Time Password (OTP)",
            react: SignInOTPEmail({ email, otp }),
        });
    }catch (error) {
        console.error("Error sending OTP email:", error);
        throw error;
    }
}