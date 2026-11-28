/**
 * GuestHeader — Header mit Turniertitel und SoccerBall-Icon
 *
 * KISS: Nur Header-Struktur rendern.
 */

import SoccerBallIcon from "./SoccerBallIcon";

interface GuestHeaderProps {
  slug: string;
}

export default function GuestHeader({ slug }: GuestHeaderProps) {
  return (
    <header className="bg-paper dark:bg-paper border-b border-slate-hairline dark:border-dark-border">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
        <SoccerBallIcon className="w-6 h-6 text-sage" />
        <h1 className="text-lg font-bold text-slate-ink dark:text-dark-text tracking-tight">
          {slug}
        </h1>
      </div>
    </header>
  );
}
