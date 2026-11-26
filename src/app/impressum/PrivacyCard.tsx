function PrivacyCard({
  sections,
}: {
  sections: Array<{ title: string; content: string }>;
}) {
  return (
    <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6 sm:p-8">
      {sections.map((section, i) => (
        <div key={i} className="mb-6 last:mb-0">
          <h3 className="text-base font-semibold text-slate-ink mb-2">
            {section.title}
          </h3>
          <p className="text-sm text-slate-stone whitespace-pre-line">
            {section.content}
          </p>
        </div>
      ))}
    </div>
  );
}

export default PrivacyCard;
