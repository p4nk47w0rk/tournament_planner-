"use client";

import { useEffect } from "react";

export default function RedirectSchedule() {
  useEffect(() => {
    window.location.replace("/turnier/bambini-cup-2026/spielplan");
  }, []);

  return <p className="text-center py-12 text-slate-stone">Weiterleitung...</p>;
}
