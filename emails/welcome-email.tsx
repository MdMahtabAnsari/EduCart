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
    Button,
    Hr,
    Link,
} from '@react-email/components';

interface WelcomeEmailProps {
    user: User;
}

export default function WelcomeEmail({ user }: WelcomeEmailProps) {
    const brand = 'EduCart';
    const year = new Date().getFullYear();
    const appUrl = 'https://educart.example.com/dashboard';
    const displayName = user.name;

    return (
        <Html>
            <Head />
            <Preview>Welcome to {brand}! 🎉</Preview>
            <Body style={styles.main}>
                <Container style={styles.container}>
                    <Section>
                        <Heading style={styles.h1}>Welcome to {brand} 🎉</Heading>

                        <Text style={styles.text}>
                            Hi {displayName}, we’re excited to have you on board. Your account is all set!
                        </Text>

                        <Text style={styles.text}>
                            Get started by exploring your dashboard, managing your courses, and personalizing your profile.
                        </Text>

                        <Section style={styles.ctaSection}>
                            <Button href={appUrl} style={styles.button}>
                                Get started
                            </Button>
                        </Section>

                        <Text style={styles.text}>
                            Need help? Visit our{' '}
                            <Link href="https://educart.example.com/help" style={styles.link}>Help Center</Link>{' '}
                            or email us at{' '}
                            <Link href="mailto:support@educart.example.com" style={styles.link}>support@educart.example.com</Link>.
                        </Text>

                        <Hr style={styles.hr} />

                        <Text style={styles.muted}>
                            You’re receiving this email because you created an account on {brand}.
                        </Text>
                        <Text style={styles.footer}>© {year} {brand}. All rights reserved.</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

export const styles: Record<string, React.CSSProperties> = {
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
    ctaSection: {
        margin: '24px 0',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#16a34a',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 600,
        textDecoration: 'none',
        padding: '12px 20px',
        borderRadius: 6,
        display: 'inline-block',
    },
    link: {
        color: '#2563eb',
        fontSize: '13px',
        textDecoration: 'underline',
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
    footer: {
        color: '#9ca3af',
        fontSize: '12px',
        margin: 0,
    },
};