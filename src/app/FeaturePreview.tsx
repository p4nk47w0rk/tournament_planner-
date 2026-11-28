interface FeatureItem {
  title: string;
  desc: string;
}

interface FeaturePreviewProps {
  t: (k: string) => string;
}

export default function FeaturePreview({ t }: FeaturePreviewProps) {
  const features: FeatureItem[] = [
    {
      title: t("features.comingSoon.title1"),
      desc: t("features.comingSoon.desc1"),
    },
    {
      title: t("features.comingSoon.title2"),
      desc: t("features.comingSoon.desc2"),
    },
    {
      title: t("features.comingSoon.title3"),
      desc: t("features.comingSoon.desc3"),
    },
  ];

  return (
    <section>
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4">
        {t("features.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map((item) => (
          <div
            key={item.title}
            className="swatch-card bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6"
          >
            <h3 className="font-bold text-sm text-slate-ink dark:text-dark-text mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-slate-stone">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
