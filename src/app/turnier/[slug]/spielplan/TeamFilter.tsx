interface TeamFilterProps {
  teams: string[];
  selected: string;
  onChange: (team: string) => void;
  t: (k: string) => string;
}

export default function TeamFilter({
  teams,
  selected,
  onChange,
  t,
}: TeamFilterProps) {
  return (
    <div className="mb-6">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-64 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm text-slate-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#3B5E4D]"
      >
        <option value="all">
          {t("filter")}: {t("all")}
        </option>
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
    </div>
  );
}
