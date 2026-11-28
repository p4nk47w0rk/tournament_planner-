/* ============================================
 * Typen
 * ============================================ */

export interface ImprintSettings {
  company: string;
  legal_form?: string;
  owner: string;
  street: string;
  postal_code: string;
  city: string;
  country?: string;
  email: string;
  phone?: string;
  vat_id?: string;
  register_court?: string;
  register_number?: string;
}

export interface PrivacySection {
  title: string;
  content: string;
}

/* ============================================
 * Default-Werte
 * ============================================ */

export const DEFAULT_IMPRINT: ImprintSettings = {
  company: "Tournament Planner",
  legal_form: "e. K.",
  owner: "Max Mustermann",
  street: "Musterstraße 1",
  postal_code: "01234",
  city: "Musterstadt",
  country: "Deutschland",
  email: "kontakt@tournament-planner.app",
  phone: "+49 123 456 789",
  vat_id: "DE123456789",
  register_court: "Amtsgericht Musterstadt",
  register_number: "HRB 12345",
};

/* ============================================
 * Hook für Tab- + Daten-Lade-Logik
 * ============================================ */

import { useEffect, useState } from "react";

export function useSettings(locale: string) {
  const [tab, setTab] = useState<"imprint" | "privacy">(() => {
    if (typeof window !== "undefined") {
      return (window.location.hash === "#privacy" ? "privacy" : "imprint") as
        "imprint" | "privacy";
    }
    return "imprint";
  });

  const [imprint, setImprint] = useState<ImprintSettings | null>(null);
  const [imprintSaved, setImprintSaved] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacySection[] | null>(null);
  const [privacySaved, setPrivacySaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/settings?locale=${locale}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (cancelled) return;
        setImprint(json.imprint ?? DEFAULT_IMPRINT);
        setPrivacy(
          (json.privacy as { sections: PrivacySection[] })?.sections ?? null
        );
      } catch {
        if (!cancelled) setImprint(DEFAULT_IMPRINT);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  // Sync hash
  useEffect(() => {
    window.location.hash = tab === "imprint" ? "imprint" : "privacy";
  }, [tab]);

  return {
    tab,
    setTab,
    imprint,
    setImprint,
    imprintSaved,
    setImprintSaved,
    privacy,
    setPrivacy,
    privacySaved,
    setPrivacySaved,
  };
}
