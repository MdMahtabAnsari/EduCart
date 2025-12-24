import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PaymentProvider } from "@/providers/payment-provider";
import { PostHogProvider } from "@/providers/post-hog-provider";
import { PostHogIdentifyProvider } from "@/providers/post-hog-identify-provider";
import { BetterAuthProvider } from "@/providers/better-auth-provder";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduCart - Online Course Platform",
  description: "Empower Your Learning Journey with EduCart - Explore, Enroll, Excel!",
  icons: {
    icon: [
      { url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1ib29rLW9wZW4tdGV4dC1pY29uIGx1Y2lkZS1ib29rLW9wZW4tdGV4dCI+PHBhdGggZD0iTTEyIDd2MTQiLz48cGF0aCBkPSJNMTYgMTJoMiIvPjxwYXRoIGQ9Ik0xNiA4aDIiLz48cGF0aCBkPSJNMyAxOGExIDEgMCAwIDEtMS0xVjRhMSAxIDAgMCAxIDEtMWg1YTQgNCAwIDAgMSA0IDQgNCA0IDAgMCAxIDQtNGg1YTEgMSAwIDAgMSAxIDF2MTNhMSAxIDAgMCAxLTEgMWgtNmEzIDMgMCAwIDAtMyAzIDMgMyAwIDAgMC0zLTN6Ii8+PHBhdGggZD0iTTYgMTJoMiIvPjxwYXRoIGQ9Ik02IDhoMiIvPjwvc3ZnPg==" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased scrollbar-hide`}
      >
        <PostHogProvider>
        <TRPCReactProvider>
          <BetterAuthProvider>
          <PaymentProvider>
            <TooltipProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <PostHogIdentifyProvider />
                {children}
                <Toaster />

              </ThemeProvider>
            </TooltipProvider>
          </PaymentProvider>
          </BetterAuthProvider>
        </TRPCReactProvider>
        </PostHogProvider>

      </body>
    </html>
  );
}
