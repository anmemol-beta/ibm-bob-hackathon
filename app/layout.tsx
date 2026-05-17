import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION, ROUTES } from "@/lib/constants";

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
          <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link
                  href={ROUTES.HOME}
                  className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent hover:from-primary-700 hover:to-accent-700 transition-all"
                >
                  {APP_NAME}
                </Link>
                <div className="flex gap-1 sm:gap-2">
                  <Link
                    href={ROUTES.AUTHOR}
                    className="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-700 dark:hover:text-primary-300 transition-all"
                  >
                    Author
                  </Link>
                  <Link
                    href={ROUTES.HANDOFF}
                    className="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-700 dark:hover:text-primary-300 transition-all"
                  >
                    Handoff
                  </Link>
                  <Link
                    href={ROUTES.PAIRING}
                    className="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-700 dark:hover:text-primary-300 transition-all"
                  >
                    Pairing
                  </Link>
                </div>
              </div>
            </nav>
          </header>
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
