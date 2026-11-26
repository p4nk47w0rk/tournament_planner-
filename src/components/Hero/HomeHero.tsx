"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";

interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TournamentStatus {
  countdown: CountdownValue | null;
  liveStatus: "preparing" | "live" | "finished";
}

export default function Hero() {
  const t = useTranslations("home");

  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { countdown, liveStatus } = useMemo(
    () => getTournamentStatus(now),
    [now]
  );

  return (
    <section className="relative overflow-hidden">
      {/* Architectural grid background */}
      <div className="architectural-grid-bg absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero content */}
        <div className="text-center mb-16">
          {/* Brand icon */}
          <div className="w-16 h-16 rounded-2xl bg-sage/10 dark:bg-sage/20 flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-9 h-9 text-sage dark:text-dark-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-ink dark:text-dark-text mb-4">
            {t("hero.title")}
          </h1>

          <p className="text-xl sm:text-2xl text-slate-stone dark:text-dark-text-secondary font-light max-w-2xl mx-auto mb-8">
            {t("hero.tagline")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-stone dark:text-dark-text-secondary font-mono">
            <span>📅 {t("hero.date")}</span>
            <span>·</span>
            <span>🕐 {t("hero.time")}</span>
            <span>·</span>
            <span>📍 {t("hero.location")}</span>
          </div>
        </div>

        {/* Countdown */}
        {countdown && liveStatus === "preparing" && (
          <div className="flex items-center justify-center gap-6 sm:gap-8 mb-12">
            <CountdownUnit
              value={countdown.days}
              label={t("hero.countdown.days")}
            />
            <span className="text-2xl font-bold text-slate-hairline dark:text-dark-border">
              :
            </span>
            <CountdownUnit
              value={countdown.hours}
              label={t("hero.countdown.hours")}
            />
            <span className="text-2xl font-bold text-slate-hairline dark:text-dark-border">
              :
            </span>
            <CountdownUnit
              value={countdown.minutes}
              label={t("hero.countdown.minutes")}
            />
            <span className="text-2xl font-bold text-slate-hairline dark:text-dark-border">
              :
            </span>
            <CountdownUnit
              value={countdown.seconds}
              label={t("hero.countdown.seconds")}
            />
          </div>
        )}

        {/* Status */}
        {liveStatus === "finished" && (
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 dark:bg-dark-secondary text-sm text-slate-stone dark:text-dark-text-secondary font-medium">
              {t("hero.status.finished")}
            </span>
          </div>
        )}
        {liveStatus === "live" && (
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-sm text-green-800 dark:text-green-300 font-medium">
              {t("hero.status.live")} ⚽
            </span>
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
          <StatCard value="10" label={t("hero.stats.teams")} />
          <StatCard value="20" label={t("hero.stats.matches")} />
          <StatCard value="2" label={t("hero.stats.fields")} />
          <StatCard value="2" label={t("hero.stats.groups")} />
        </div>
      </div>
    </section>
  );
}

// ============================================
// Tournament status computation (pure function)
// ============================================

function getTournamentStatus(now: number): TournamentStatus {
  const tDate = new Date("2026-12-05T09:00:00").getTime();
  const eDate = new Date("2026-12-05T13:00:00").getTime();
  const isPast = now > eDate;
  const isLive = now >= tDate && now <= eDate;

  let liveStatus: "preparing" | "live" | "finished";
  if (isPast) {
    liveStatus = "finished";
  } else if (isLive) {
    liveStatus = "live";
  } else {
    liveStatus = "preparing";
  }

  let countdown: CountdownValue | null = null;
  if (!isPast) {
    const diff = tDate - now;
    if (diff > 0) {
      countdown = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    }
  }

  return { countdown, liveStatus };
}

// ============================================
// CountdownUnit
// ============================================

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

// ============================================
// StatCard
// ============================================

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
