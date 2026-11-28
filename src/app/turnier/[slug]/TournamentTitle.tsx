import DateIcon from "./DateIcon";
import LocationIcon from "./LocationIcon";

interface TournamentTitleProps {
  tournament: { name: string; date: string; location: string; status: string };
  t: (k: string) => string;
}

export default function TournamentTitle({
  tournament,
  t,
}: TournamentTitleProps) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text mb-2">
        {tournament.name}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-stone dark:text-dark-text-secondary">
        <DateInfo date={tournament.date} t={t} />
        <LocationInfo location={tournament.location} />
        <StatusBadge status={tournament.status} t={t} />
      </div>
    </div>
  );
}

function DateInfo({ date, t }: { date: string; t: (k: string) => string }) {
  return (
    <span className="flex items-center gap-1.5">
      <DateIcon className="w-4 h-4" />
      {date}
    </span>
  );
}

function LocationInfo({ location }: { location: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <LocationIcon className="w-4 h-4" />
      {location}
    </span>
  );
}

function StatusBadge({
  status,
  t,
}: {
  status: string;
  t: (k: string) => string;
}) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium">
      {t("status." + status)}
    </span>
  );
}
