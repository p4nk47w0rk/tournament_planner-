function ImprintCard({
  settings,
}: {
  settings: Record<string, string | undefined>;
}) {
  const fields = buildImprintFields(settings);

  return (
    <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-ink text-slate-ink mb-6">
        {settings.company}
      </h2>

      <div className="flex flex-col gap-0">
        {fields.map(({ label, value }, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-slate-hairline dark:border-slate-hairline last:border-b-0 gap-1"
          >
            <span className="text-sm text-slate-stone font-medium">
              {label}
            </span>
            <span
              className="text-sm text-slate-ink text-slate-ink"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function buildImprintFields(s: Record<string, string | undefined>) {
  const fields: { label: string; value: string }[] = [];

  fields.push({ label: "Inhaber", value: s.owner ?? "" });
  if (s.legal_form) {
    fields.push({ label: "Rechtsform", value: s.legal_form });
  }

  const address = [s.street, `${s.postal_code} ${s.city}`]
    .filter(Boolean)
    .join(", ");
  fields.push({ label: "Anschrift", value: address });

  if (s.country) {
    fields.push({ label: "Land", value: s.country });
  }

  if (s.phone) {
    fields.push({ label: "Telefon", value: s.phone });
  }
  fields.push({
    label: "E-Mail",
    value: `<a href="mailto:${s.email}" className="text-sage hover:underline">${s.email}</a>`,
  });

  if (s.vat_id) {
    fields.push({ label: "USt-IdNr.", value: s.vat_id });
  }
  if (s.register_court && s.register_number) {
    fields.push({
      label: "Register",
      value: `${s.register_court} · ${s.register_number}`,
    });
  }

  return fields;
}

export default ImprintCard;
