"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type Locale = "de" | "cs";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  // Wird vom Server übergeben → initialer SSR-Look
  initialLocale: Locale | null;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "de",
  setLocale: () => {},
  initialLocale: null,
});

interface LocaleProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
}

export function LocaleProvider({
  children,
  initialLocale,
}: LocaleProviderProps) {
  // Server-Wert verwenden (vermeidet Hydration-Mismatch)
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, initialLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
