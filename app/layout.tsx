import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import Nav from "@/components/Nav";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
          <Nav />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  &copy; 2026 {APP_NAME}. Built for IBM Bob Hackathon.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Async pair programming across time zones
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

// Made with Bob
