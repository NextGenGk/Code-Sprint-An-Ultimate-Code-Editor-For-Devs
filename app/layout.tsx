import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ClerkProvider } from '@clerk/nextjs';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorHandler } from './error-handler';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: "CodeSprint - Online Coding Platform",
  description: "Practice coding problems with real-time execution and testing",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If Clerk is not configured, render without authentication
  if (!publishableKey) {
  return (
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        <body className="antialiased">
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h1 className="text-2xl font-bold mb-4">CodeSprint</h1>
              <p className="text-gray-400 mb-4">
                Authentication is not configured. Please set up your environment variables.
              </p>
              <div className="bg-gray-800 p-4 rounded-lg text-left text-sm">
                <p className="mb-2">Required environment variables:</p>
                <code className="block bg-gray-900 p-2 rounded mb-2">
                  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
                </code>
                <code className="block bg-gray-900 p-2 rounded">
                  CLERK_SECRET_KEY=your_secret_key
                </code>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ErrorBoundary>
          <ClerkProvider publishableKey={publishableKey}>
            <ThemeProvider>
              <ErrorHandler />
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
            </ThemeProvider>
          </ClerkProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
