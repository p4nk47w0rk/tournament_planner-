"use client";

import { TPWordmarkLight, TPWordmarkDark } from "../Shared/BrandSVGs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isDark, setIsDark] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  return (
    <footer className="border-t border-slate-hairline dark:border-slate-hairline mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Branding row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
          {isDark ? (
            <TPWordmarkDark className="h-8 w-auto" />
          ) : (
            <TPWordmarkLight className="h-8 w-auto" />
          )}
        </div>

        {/* Links row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-stone">
          <a
            href="/impressum"
            className="hover:text-sage dark:hover:text-dark-primary transition-colors"
          >
            Impressum
          </a>
          <a
            href="/datenschutz"
            className="hover:text-sage dark:hover:text-dark-primary transition-colors"
          >
            Datenschutz
          </a>
        </div>
      </div>
    </footer>
  );
}
