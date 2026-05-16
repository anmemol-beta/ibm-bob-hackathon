import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION, ROUTES } from "@/lib/constants";

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
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href={ROUTES.HOME} className="text-2xl font-bold">
                  {APP_NAME}
                </Link>
                <div className="flex gap-6">
                  <Link
                    href={ROUTES.AUTHOR}
                    className="hover:text-blue-600 transition-colors"
                  >
                    Author
                  </Link>
                  <Link
                    href={ROUTES.HANDOFF}
                    className="hover:text-blue-600 transition-colors"
                  >
                    Handoff
                  </Link>
                  <Link
                    href={ROUTES.PAIRING}
                    className="hover:text-blue-600 transition-colors"
                  >
                    Pairing
                  </Link>
                </div>
              </div>
            </nav>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t py-4 text-center text-sm text-gray-600">
            <p>&copy; 2026 {APP_NAME}. Built for IBM Bob Hackathon.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

// Made with Bob
