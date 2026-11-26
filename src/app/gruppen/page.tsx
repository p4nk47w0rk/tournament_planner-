"use client";

import { useEffect } from "react";

export default function RedirectStandings() {
  useEffect(() => {
    window.location.replace("/turnier/bambini-cup-2026/gruppen");
  }, []);

  return <p className="text-center py-12 text-slate-stone">Weiterleitung...</p>;
}
