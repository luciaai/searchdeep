// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import { Syne } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://healthiliving.com"),
  title: "Deep Search",
  description:
    "Deep Search is a minimalistic AI-powered search engine that helps you find information on the internet.",
  openGraph: {
    url: "https://healthiliving.com",
    siteName: "Deep Search",
  },
  keywords: [
    "Homeschool research",
    "research",
    "school",
    "reality",
    "fiction",
    "schooling",
    "ai search engine",
    "search engine",
    "AI",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  preload: true,
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${GeistSans.variable} ${syne.variable} font-sans antialiased`}>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <NuqsAdapter>
            <Providers>
              <Toaster position="top-center" richColors theme="system" />
              {children}
            </Providers>
          </NuqsAdapter>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}