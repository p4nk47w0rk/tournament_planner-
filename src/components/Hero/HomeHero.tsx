"use client";

import { useTranslations } from "next-intl";
import { INITIAL_MATCHES } from "@/lib/tournament-data";
import { useState, useEffect, useMemo } from "react";

interface HeroProps {}

export default function Hero() {
  const t = useTranslations("home");

  const tournamentDate = new Date("2026-12-05T09:00:00");
  const endTournamentDate = new Date("2026-12-05T13:00:00");

  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const countdown = useMemo(() => {
    const diff = tournamentDate.getTime() - now;
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }, [now]);

  const isLive =
    now >= tournamentDate.getTime() && now <= endTournamentDate.getTime();
  const isPast = now > endTournamentDate.getTime();
  const liveStatus = isPast ? "finished" : isLive ? "live" : "preparing";

  return (
    <section className="relative overflow-hidden">
      {/* Architectural grid background */}
      <div className="architectural-grid-bg absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero content */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/10 text-sage dark:bg-dark-primary/20 dark:text-dark-primary text-sm font-medium mb-6">
            <span
              className={`w-2 h-2 rounded-full ${isLive ? "bg-terracotta animate-pulse" : isPast ? "bg-sage" : "bg-ochre"}`}
            />
            {t(`liveStatus.${liveStatus}`)}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tightest text-slate-ink dark:text-dark-text mb-4">
            {t("title")}
          </h1>

          <p className="text-xl sm:text-2xl text-slate-stone dark:text-dark-text-secondary font-light max-w-2xl mx-auto mb-8">
            {t("tagline")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-stone dark:text-dark-text-secondary font-mono">
            <span>📅 5. Dezember 2026</span>
            <span>·</span>
            <span>🕐 09:00 Uhr</span>
            <span>·</span>
            <span>📍 Sporthalle Vilémov</span>
          </div>
        </div>

        {/* Countdown */}
        {countdown && liveStatus === "preparing" && (
          <div className="flex items-center justify-center gap-6 sm:gap-8 mb-12">
            <CountdownUnit value={countdown.days} label={t("countdown.days")} />
            <span className="text-2xl font-bold text-slate-hairline dark:text-dark-border">
              :
            </span>
            <CountdownUnit
              value={countdown.hours}
              label={t("countdown.hours")}
            />
            <span className="text-2xl font-bold text-slate-hairline dark:text-dark-border">
              :
            </span>
            <CountdownUnit
              value={countdown.minutes}
              label={t("countdown.minutes")}
            />
            <span className="text-2xl font-bold text-slate-hairline dark:text-dark-border">
              :
            </span>
            <CountdownUnit
              value={countdown.seconds}
              label={t("countdown.seconds")}
            />
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
          <StatCard value="10" label={t("stats.teams")} />
          <StatCard value="20" label={t("stats.matches")} />
          <StatCard value="2" label={t("stats.fields")} />
          <StatCard value="2" label={t("stats.groups")} />
        </div>
      </div>
    </section>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold font-mono text-slate-ink dark:text-dark-text">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-xs text-slate-stone dark:text-dark-text-secondary mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-paper border border-slate-hairline dark:border-dark-border rounded-xl p-4 text-center swatch-card">
      <div className="text-2xl font-bold font-mono text-sage dark:text-dark-primary">
        {value}
      </div>
      <div className="text-xs text-slate-stone dark:text-dark-text-secondary mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}
