import SettingsContent from "../impressum/SettingsContent";

/**
 * Datenschutzerklärung — öffentlich, clientseitig geladen.
 */
export const metadata = {
  title: "Datenschutzerklärung — Tournament Planner",
  description: "Informationen zur Datenverarbeitung",
};

export default function DatenschutzPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-ink text-slate-ink">
          Datenschutzerklärung
        </h1>
        <p className="text-sm text-slate-stone mt-2">
          Informationen zur Datenverarbeitung
        </p>
      </div>

      <SettingsContent settingsKey="privacy" />

      {/* Stand */}
      <p className="text-center text-xs text-slate-stone mt-8">
        Stand: November 2026
      </p>
    </div>
  );
}
