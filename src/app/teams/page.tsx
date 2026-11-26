"use client";

import { useEffect } from "react";

export default function RedirectTeams() {
  useEffect(() => {
    window.location.replace("/turnier/bambini-cup-2026/teams");
  }, []);

  return <p className="text-center py-12 text-slate-stone">Weiterleitung...</p>;
}
