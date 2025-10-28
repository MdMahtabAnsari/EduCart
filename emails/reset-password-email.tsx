import { User } from 'better-auth';
import {styles} from './welcome-email'
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


interface ResetPasswordEmailProps {
    user: User;
    url: string;
}

export default function ResetPasswordEmail({ user, url }: ResetPasswordEmailProps) {
    const brand = 'EduCart';
    const year = new Date().getFullYear();
    const displayName = user.name;

    return (
        <Html>
            <Head />
            <Preview>Reset your {brand} password</Preview>
            <Body style={styles.main}>
                <Container style={styles.container}>
                    <Section>
                        <Heading style={styles.h1}>Reset your password</Heading>

                        <Text style={styles.text}>
                            Hi {displayName}, we received a request to reset your {brand} password.
                        </Text>

                        <Text style={styles.text}>
                            Click the button below to create a new password. This link will expire soon for your security.
                        </Text>

                        <Section style={styles.ctaSection}>
                            <Button href={url} style={styles.button}>
                                Reset password
                            </Button>
                        </Section>

                        <Text style={styles.text}>
                            If the button doesn’t work, copy and paste this URL into your browser:
                        </Text>
                        <Link href={url} style={styles.link}>
                            {url}
                        </Link>

                        <Hr style={styles.hr} />

                        <Text style={styles.muted}>
                            If you didn’t request a password reset, you can safely ignore this email.
                        </Text>
                        <Text style={styles.footer}>© {year} {brand}. All rights reserved.</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
