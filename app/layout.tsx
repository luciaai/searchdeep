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
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import AuthHandler from "@/components/auth/auth-handler";
import { EmailVerificationPrompt } from "@/components/email-verification-prompt";
import MaintenanceWrapper from "./maintenance-wrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://healthiliving.com"),
  title: "Ziq",
  description:
    "Ziq is an AI-powered research assistant for students, homeschoolers, researchers, and lifelong learners. It helps you find, synthesize, and cite reliable information from across the web for academic, educational, and professional needs.",
  icons: {
    icon: [
      { url: "/new-icons/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" }
    ],
    shortcut: "/new-icons/favicon.svg",
    apple: { url: "/logo.png" },
  },
  openGraph: {
    url: "https://healthiliving.com",
    siteName: "Deep Search",
    title: "Ziq – AI Research Assistant for Students & Learners",
    description: "Ziq helps students, homeschoolers, researchers, and lifelong learners find and synthesize reliable information from the web, with citations and educational tools.",
    images: [
      {
        url: "https://healthiliving.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ziq AI Research Assistant Preview"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    site: "@ziqsearch",
    title: "Ziq – AI Research Assistant for Students & Learners",
    description: "Ziq helps students, researchers, and lifelong learners find and synthesize reliable information from the web, with citations and educational tools.",
    images: ["https://healthiliving.com/og-image.png"]
  },
  keywords: [
    "Study Aid",
    "Academic Research",
    "Homework Helper",
    "Literature Review",
    "Scholarly Search",
    "Citation Generator",
    "Knowledge Builder",
    "Learning Insights",
    "Educational Tool",
    "Lesson Planning",
    "Classroom Resource",
    "Research Assistant",
    "Source Finder",
    "Paper Summaries",
    "Fact-Checked",
    "Source Transparency",
    "Critical Thinking",
    "Student Learning",
    "Research Synthesis",
    "Academic Support",
    "Exam Prep",
    "Students",
    "Researchers",
    "Education",
    "AI",
    "search engine"
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
          <NuqsAdapter>
            <Providers>
              <AuthHandler />
              <MaintenanceWrapper>
                <NavBar />
                <Toaster position="top-center" richColors theme="system" />
                <EmailVerificationPrompt />
                <div className="flex flex-col min-h-screen">
                  {children}
                  <Footer />
                </div>
              </MaintenanceWrapper>
            </Providers>
          </NuqsAdapter>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}