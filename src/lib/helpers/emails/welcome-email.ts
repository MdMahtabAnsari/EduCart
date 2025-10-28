import { User } from "better-auth";
import { resend } from "@/lib/mail/resend";
import WelcomeEmail from "../../../../emails/welcome-email";

export async function sendWelcomeEmail({ user }: { user: User }) {
    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: user.email,
            subject: `Welcome to EduCart, ${user.name}!`,
            react: WelcomeEmail({ user }),
        });
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw error;
    }
}