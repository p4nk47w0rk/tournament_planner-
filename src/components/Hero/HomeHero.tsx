import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import HeroIcon from "./HeroIcon";
import HeroHeader from "./HeroHeader";
import HeroCountdown from "./HeroCountdown";
import HeroStatus from "./HeroStatus";
import HeroStats from "./HeroStats";
import {
  getTournamentStatus,
  type TournamentStatus,
  type CountdownValue,
} from "./status";

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
      <div className="architectural-grid-bg absolute inset-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <HeroContent t={t} countdown={countdown} liveStatus={liveStatus} />
      </div>
    </section>
  );
}

function HeroContent({
  t,
  countdown,
  liveStatus,
}: {
  t: (k: string) => string;
  countdown: CountdownValue | null;
  liveStatus: "preparing" | "live" | "finished";
}) {
  return (
    <div className="text-center mb-16">
      <HeroIcon />
      <HeroHeader t={t} />
      <HeroCountdown countdown={countdown} t={t} />
      <HeroStatus liveStatus={liveStatus} t={t} />
      <HeroStats t={t} />
    </div>
  );
}
