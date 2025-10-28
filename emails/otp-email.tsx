import { User } from 'better-auth';
import * as React from 'react';
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Heading,
    Text,
    Hr,
} from '@react-email/components';

interface OTPEmailProps {
    user: User;
    otp: string;
}

export default function OTPEmail({ user, otp }: OTPEmailProps) {
    const brand = 'EduCart';
    const year = new Date().getFullYear();
    const displayName = user.name || 'there';
    const safeOTP = String(otp ?? '').replace(/\s+/g, '');

    return (
        <Html>
            <Head />
            <Preview>Your {brand} verification code</Preview>
            <Body style={styles.main}>
                <Container style={styles.container}>
                    <Section>
                        <Heading style={styles.h1}>Your verification code</Heading>

                        <Text style={styles.text}>
                            Hi {displayName}, use the code below to complete your sign-in.
                        </Text>

                        <Section style={styles.otpSection} aria-label="One-time passcode">
                            {safeOTP.split('').map((d, i) => (
                                <span key={i} style={styles.otpDigit}>{d}</span>
                            ))}
                        </Section>

                        <Text style={styles.codeNote}>
                            Code: <span style={styles.codeInline}>{safeOTP}</span>
                        </Text>

                        <Text style={styles.textMuted}>
                            For your security, this code will expire soon and can only be used once.
                        </Text>

                        <Hr style={styles.hr} />

                        <Text style={styles.muted}>
                            If you didn’t request this, you can safely ignore this email.
                        </Text>
                        <Text style={styles.footer}>© {year} {brand}. All rights reserved.</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}


const styles: Record<string, React.CSSProperties> = {
    main: {
        backgroundColor: '#f6f9fc',
        padding: '24px 0',
        fontFamily:
            '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji',
    },
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        border: '1px solid #eaeaea',
        padding: '32px',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
    },
    h1: {
        margin: '0 0 16px',
        fontSize: '24px',
        lineHeight: '1.3',
        color: '#111827',
        fontWeight: 700,
    },
    text: {
        margin: '0 0 16px',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#374151',
    },
    otpSection: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        margin: '20px 0 8px',
    },
    otpDigit: {
        display: 'inline-block',
        minWidth: '42px',
        padding: '12px 10px',
        textAlign: 'center',
        fontSize: '22px',
        fontWeight: 700,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        color: '#111827',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
    },
    codeNote: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '12px',
        margin: '4px 0 16px',
    },
    codeInline: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontWeight: 700,
        color: '#111827',
    },
    hr: {
        borderColor: '#e5e7eb',
        margin: '24px 0',
    },
    muted: {
        color: '#6b7280',
        fontSize: '12px',
        margin: '0 0 4px',
    },
    textMuted: {
        color: '#6b7280',
        fontSize: '12px',
        margin: '0 0 8px',
        textAlign: 'center',
    },
    footer: {
        color: '#9ca3af',
        fontSize: '12px',
        margin: 0,
    },
};