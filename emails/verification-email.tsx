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

interface VerificationEmailProps {
    user: User;
    url: string;
}

export default function VerificationEmail({ user, url }: VerificationEmailProps) {
    const brand = 'EduCart';
    const year = new Date().getFullYear();
    const displayName = user.name;
    return (
        <Html>
            <Head />
            <Preview>Verify your email for {brand}</Preview>
            <Body style={styles.main}>
                <Container style={styles.container}>
                    <Section>
                        <Heading style={styles.h1}>Verify your email</Heading>
                        <Text style={styles.text}>
                            Hi {displayName}, thanks for signing up for {brand}. Please confirm your email
                            address to get started.
                        </Text>

                        <Section style={styles.ctaSection}>
                            <Button href={url} style={styles.button}>
                                Verify email
                            </Button>
                        </Section>

                        <Text style={styles.text}>
                            This link will expire soon for your security. If the button doesn’t work, copy and
                            paste this URL into your browser:
                        </Text>
                        <Link href={url} style={styles.link}>
                            {url}
                        </Link>

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
    ctaSection: {
        margin: '24px 0',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2563eb',
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
        wordBreak: 'break-all',
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