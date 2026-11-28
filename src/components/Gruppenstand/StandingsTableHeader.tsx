export default function StandingsTableHeader() {
  return (
    <thead>
      <tr className="border-b border-slate-200 dark:border-slate-hairline">
        <HeaderCell className="w-10 text-center">#</HeaderCell>
        <HeaderCell className="text-left">Team</HeaderCell>
        <HeaderCell className="text-center hidden sm:table-cell">Sp</HeaderCell>
        <HeaderCell className="text-center hidden sm:table-cell">S</HeaderCell>
        <HeaderCell className="text-center hidden md:table-cell">U</HeaderCell>
        <HeaderCell className="text-center hidden sm:table-cell">N</HeaderCell>
        <HeaderCell className="text-center">Tore</HeaderCell>
        <HeaderCell className="text-center">TD</HeaderCell>
        <HeaderCell className="text-center">Pkt</HeaderCell>
      </tr>
    </thead>
  );
}

function HeaderCell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <th
      className={`py-3 px-2 font-semibold text-slate-600 text-slate-stone ${className}`}
    >
      {children}
    </th>
  );
}
