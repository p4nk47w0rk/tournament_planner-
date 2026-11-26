"use client";

import type { PrivacySection } from "@/app/admin/settings/page";

/* ============================================
 * PrivacyEditor
 * ============================================ */

export default function PrivacyEditor({
  sections,
  onChange,
  onSave,
  saved,
}: {
  sections: PrivacySection[];
  onChange: (s: PrivacySection[]) => void;
  onSave: () => void;
  saved: boolean;
}) {
  const updateSection = (
    index: number,
    field: "title" | "content",
    value: string
  ) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addSection = () => {
    onChange([...sections, { title: "Neuer Abschnitt", content: "" }]);
  };

  const removeSection = (index: number) => {
    if (sections.length <= 1) return;
    onChange(sections.filter((_, i) => i !== index));
  };

  const cardStyle =
    "bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6 sm:p-8";

  return (
    <div className="space-y-6">
      {sections.map((section, i) => (
        <section key={i} className={cardStyle}>
          <SectionHeader
            index={i + 1}
            count={sections.length}
            onRemove={() => removeSection(i)}
          />
          <SectionFields
            section={section}
            onChange={(f, v) => updateSection(i, f, v)}
          />
        </section>
      ))}

      <button
        onClick={addSection}
        className="btn-ghost inline-flex items-center gap-1 text-sm"
      >
        + Abschnitt hinzufügen
      </button>

      <div className="flex items-center justify-end gap-3 pt-4">
        {saved && <span className="text-sm text-sage">✓ Gespeichert</span>}
        <button
          onClick={onSave}
          className="btn-primary inline-flex items-center gap-2"
        >
          Speichern
        </button>
      </div>
    </div>
  );
}

/* ============================================
 * Sub-Components
 * ============================================ */

function SectionHeader({
  index,
  count,
  onRemove,
}: {
  index: number;
  count: number;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-mono text-slate-stone">
        Abschnitt {index}
      </span>
      <button
        onClick={onRemove}
        disabled={count <= 1}
        className="text-xs text-terracotta hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Entfernen
      </button>
    </div>
  );
}

function SectionFields({
  section,
  onChange,
}: {
  section: PrivacySection;
  onChange: (f: "title" | "content", v: string) => void;
}) {
  const input =
    "w-full px-3 py-2.5 text-sm border border-slate-hairline dark:border-slate-hairline rounded-lg bg-paper dark:bg-muted text-slate-ink text-slate-ink focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors";
  const label = "block text-sm font-medium text-slate-stone mb-1.5";

  return (
    <div className="space-y-4">
      <div>
        <label className={label}>Titel</label>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onChange("title", e.target.value)}
          className={input}
        />
      </div>
      <div>
        <label className={label}>Inhalt (Zeilenumbrüche möglich)</label>
        <textarea
          rows={6}
          value={section.content}
          onChange={(e) => onChange("content", e.target.value)}
          className={input}
        />
      </div>
    </div>
  );
}
