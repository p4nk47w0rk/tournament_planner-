import { type StandingsRow } from "@/lib/types";

interface StandingsBodyProps {
  standings: StandingsRow[];
}

export default function StandingsBody({ standings }: StandingsBodyProps) {
  return (
    <tbody>
      {standings.map((row) => (
        <StandingsRow key={row.team} row={row} />
      ))}
    </tbody>
  );
}

function StandingsRow({ row }: { row: StandingsRow }) {
  const isTop2 = row.rank! <= 2;
  return (
    <tr
      className={`border-b border-slate-hairline transition-colors ${isTop2 ? "bg-green-50/50 dark:bg-green-900/10" : ""} hover:bg-slate-50 dark:hover:bg-dark-secondary/50`}
    >
      <td className="py-3 px-2 text-center font-bold text-slate-900 text-slate-ink">
        {row.rank}
      </td>
      <td className="py-3 px-2">
        <TeamCell row={row} />
      </td>
      <td className="py-3 px-2 text-center text-slate-600 text-slate-stone hidden sm:table-cell">
        {row.played}
      </td>
      <td className="py-3 px-2 text-center text-slate-600 text-slate-stone hidden sm:table-cell">
        {row.won}
      </td>
      <td className="py-3 px-2 text-center text-slate-600 text-slate-stone hidden md:table-cell">
        {row.drawn}
      </td>
      <td className="py-3 px-2 text-center text-slate-600 text-slate-stone hidden sm:table-cell">
        {row.lost}
      </td>
      <td className="py-3 px-2 text-center font-mono text-slate-700 text-slate-ink">
        {row.goalsFor}:{row.goalsAgainst}
      </td>
      <td className="py-3 px-2 text-center font-mono font-medium text-slate-700 text-slate-ink">
        {row.goalDifference > 0 ? "+" : ""}
        {row.goalDifference}
      </td>
      <td className="py-3 px-2 text-center font-bold text-slate-900 text-slate-ink">
        {row.points}
      </td>
    </tr>
  );
}

function TeamCell({ row }: { row: StandingsRow }) {
  return (
    <div className="flex items-center gap-2">
      {row.rank! <= 2 && (
        <span
          className="w-2 h-2 rounded-full bg-green-500"
          title="Playoff-Platz"
        />
      )}
      {row.logo ? (
        <img
          src={row.logo}
          alt={`${row.team} Logo`}
          className="w-6 h-6 object-contain shrink-0"
          loading="lazy"
        />
      ) : (
        <div className="w-6 h-6 rounded bg-slate-200 dark:bg-dark-secondary shrink-0" />
      )}
      <span className="font-medium text-slate-900 text-slate-ink">
        {row.team}
      </span>
    </div>
  );
}
