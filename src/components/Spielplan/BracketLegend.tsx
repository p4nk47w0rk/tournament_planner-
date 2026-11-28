export default function BracketLegend() {
  return (
    <div className="mt-8 p-4 bg-muted rounded-xl">
      <h4 className="font-semibold text-sm text-slate-600 text-slate-stone mb-3">
        🏆 Playoff-Struktur
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <LegendItem color="bg-green-500" label="Play-in (2 Spiele)" />
        <LegendItem color="bg-blue-500" label="Viertelfinale (4 Spiele)" />
        <LegendItem color="bg-amber-500" label="Halbfinale (2 Spiele)" />
        <LegendItem color="bg-purple-500" label="Finale + Platz 3" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded ${color}`} />
      <span className="text-slate-600 text-slate-stone">{label}</span>
    </div>
  );
}
