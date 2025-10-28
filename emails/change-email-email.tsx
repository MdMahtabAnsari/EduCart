import { User } from 'better-auth';
import {styles} from './welcome-email';
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

interface ChangeEmailEmailProps {
    user: User;
    url: string;
    newEmail: string;
}

export default function ChangeEmailEmail({ user, url, newEmail }: ChangeEmailEmailProps) {
    const brand = 'EduCart';
    const year = new Date().getFullYear();
    const displayName = user.name;

    return (
        <Html>
            <Head />
            <Preview>Approve your {brand} email change</Preview>
            <Body style={styles.main}>
                <Container style={styles.container}>
                    <Section>
                        <Heading style={styles.h1}>Confirm your email change</Heading>

                        <Text style={styles.text}>
                            Hi {displayName}, we received a request to change your {brand} account email.
                        </Text>

                        <Text style={styles.text}>
                            Current email: <strong>{user.email}</strong><br />
                            New email: <strong>{newEmail ?? 'Requested new email'}</strong>
                        </Text>

                        <Text style={styles.text}>
                            To approve this change, click the button below:
                        </Text>

                        <Section style={styles.ctaSection}>
                            <Button href={url} style={styles.button}>
                                Approve email change
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
                            If you didn’t request this change, you can safely ignore this email and your email will remain the same.
                        </Text>
                        <Text style={styles.footer}>© {year} {brand}. All rights reserved.</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
