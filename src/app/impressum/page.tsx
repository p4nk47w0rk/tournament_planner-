import SettingsContent from "./SettingsContent";

/**
 * Impressum — öffentlich, serverseitig gerendert.
 * Die SettingsContent-Komponente handhabt eigenständig Loading- und Fallback-Zustände.
 */
export const metadata = {
  title: "Impressum — Tournament Planner",
  description: "Angaben gemäß § 5 DDG",
};

export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-ink text-slate-ink">
          Impressum
        </h1>
        <p className="text-sm text-slate-stone mt-2">Angaben gemäß § 5 DDG</p>
      </div>

      <SettingsContent settingsKey="imprint" />
    </div>
  );
}
