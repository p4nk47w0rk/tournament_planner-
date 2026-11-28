export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TournamentStatus {
  countdown: CountdownValue | null;
  liveStatus: "preparing" | "live" | "finished";
}

export function getTournamentStatus(now: number): TournamentStatus {
  const tDate = new Date("2026-12-05T09:00:00").getTime();
  const eDate = new Date("2026-12-05T13:00:00").getTime();
  const isPast = now > eDate;
  const isLive = now >= tDate && now <= eDate;

  let liveStatus: "preparing" | "live" | "finished";
  if (isPast) liveStatus = "finished";
  else if (isLive) liveStatus = "live";
  else liveStatus = "preparing";

  let countdown: CountdownValue | null = null;
  if (!isPast) {
    const diff = tDate - now;
    if (diff > 0) {
      countdown = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    }
  }

  return { countdown, liveStatus };
}
