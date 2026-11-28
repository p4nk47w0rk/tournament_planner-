import CountdownUnit from "./CountdownUnit";

interface HeroCountdownProps {
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null;
  t: (k: string) => string;
}

export default function HeroCountdown({ countdown, t }: HeroCountdownProps) {
  if (!countdown) return null;
  return (
    <div className="flex items-center justify-center gap-6 sm:gap-8 mb-12">
      <CountdownUnit value={countdown.days} label={t("hero.countdown.days")} />
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
  );
}
