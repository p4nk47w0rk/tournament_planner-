"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_IMPRINT,
  type ImprintSettings,
  type PrivacySection,
} from "@/app/admin/settings/types";

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
