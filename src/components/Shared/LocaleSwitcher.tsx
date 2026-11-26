"use client";

import { useLocale } from "@/lib/locale-context";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function LocaleSwitcher() {
  const { locale } = useLocale();
  const _t = useTranslations("nav");
  const _router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "de" ? "cs" : "de";

  const handleSwitch = () => {
    // Hard navigation: URL mit ?locale=cs aufrufen → Middleware setzt Cookie
    // → leitet ohne Query-Param um → Server rendert mit neuer Locale.
    // Ein echter Browser-Navigation (nicht Client-Side Router), damit die
    // Middleware durchlaufen wird.
    window.location.href = `${pathname}?locale=${nextLocale}`;
  };

  return (
    <button
      onClick={handleSwitch}
      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                 bg-slate-100 dark:bg-dark-secondary text-slate-600 dark:text-dark-text-secondary
                 hover:bg-slate-200 dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-[#3B5E4D]"
      aria-label="Sprache wechseln"
    >
      {locale === "de" ? "🇩🇪 DE" : "🇨🇿 CS"}
    </button>
  );
}
