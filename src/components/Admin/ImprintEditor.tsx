"use client";

import { useState } from "react";
import type { ImprintSettings } from "@/app/admin/settings/types";

/* ============================================
 * Formular-Felder für Impressum
 * ============================================ */

const FIELDS: { key: keyof ImprintSettings; label: string; type?: string }[] = [
  { key: "company", label: "Firma / Name" },
  { key: "legal_form", label: "Rechtsform", type: "text" },
  { key: "owner", label: "Inhaber" },
  { key: "street", label: "Straße & Hausnummer" },
  { key: "postal_code", label: "PLZ" },
  { key: "city", label: "Ort" },
  { key: "country", label: "Land", type: "text" },
  { key: "phone", label: "Telefon", type: "tel" },
  { key: "email", label: "E-Mail" },
  { key: "vat_id", label: "USt-IdNr.", type: "text" },
  { key: "register_court", label: "Registergericht", type: "text" },
  { key: "register_number", label: "Registernummer", type: "text" },
];

/* ============================================
 * ImprintEditor
 * ============================================ */

export default function ImprintEditor({
  settings,
  onChange,
  onSave,
  saved,
}: {
  settings: ImprintSettings;
  onChange: (s: ImprintSettings) => void;
  onSave: () => void;
  saved: boolean;
}) {
  const [editing, setEditing] = useState<keyof ImprintSettings | null>(null);

  const update = (key: keyof ImprintSettings, value: string) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6 sm:p-8">
      <div className="space-y-5">
        {FIELDS.map(({ key, label, type = "text" }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-stone mb-1.5">
              {label}
            </label>
            <input
              type={type}
              value={settings[key] as string}
              onChange={(e) => update(key, e.target.value)}
              onFocus={() => setEditing(key)}
              onBlur={() => setEditing(null)}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-paper dark:bg-muted text-slate-ink text-slate-ink focus:outline-none focus:ring-2 focus:ring-sage/30 transition-colors ${
                editing === key
                  ? "border-sage"
                  : "border-slate-hairline dark:border-slate-hairline"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
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
