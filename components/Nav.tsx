"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, ROUTES } from "@/lib/constants";

const NAV_LINKS = [
  { href: ROUTES.AUTHOR, label: "Author" },
  { href: ROUTES.HANDOFF, label: "Handoff" },
  { href: ROUTES.PAIRING, label: "Pairing" },
];

/**
 * Top navigation bar. Highlights the current route so users always know
 * which page they are on.
 */
export default function Nav() {
  const pathname = usePathname();

  return (
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
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    "px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all " +
                    (isActive
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200"
                      : "text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-700 dark:hover:text-primary-300")
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}

// Made with Bob
