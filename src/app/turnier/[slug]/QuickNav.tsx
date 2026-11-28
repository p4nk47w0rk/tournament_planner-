import QuickLink from "./QuickLink";

interface QuickNavProps {
  slug: string;
  t: (k: string) => string;
}

export default function QuickNav({ slug, t }: QuickNavProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      <QuickLink
        href={`/turnier/${slug}/spielplan`}
        label={t("quickLinks.schedule")}
        icon="schedule"
      />
      <QuickLink
        href={`/turnier/${slug}/gruppen`}
        label={t("quickLinks.standings")}
        icon="standings"
      />
      <QuickLink
        href={`/turnier/${slug}/teams`}
        label={t("quickLinks.teams")}
        icon="teams"
      />
    </div>
  );
}
