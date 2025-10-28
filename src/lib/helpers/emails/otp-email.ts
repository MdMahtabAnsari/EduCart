import {User} from "better-auth";
import {resend} from "@/lib/mail/resend";
import OTPEmail from "../../../../emails/otp-email";


export async function sendOTPEmail({user, otp}: {user: User; otp: string}) {
    try{
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: user.email,
            subject: "Your One-Time Password (OTP)",
            react: OTPEmail({user, otp}),
        });
    }catch (error) {
        console.error("Error sending OTP email:", error);
        throw error;
    }
}