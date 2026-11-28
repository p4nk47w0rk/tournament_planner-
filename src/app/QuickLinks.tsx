import Link from "next/link";

interface QuickLink {
  href: string;
  label: string;
  icon: string;
  description: string;
}

interface QuickLinksProps {
  links: QuickLink[];
  iconMap: Record<string, React.FC<{ className?: string }>>;
}

export default function QuickLinks({ links, iconMap }: QuickLinksProps) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4">
        Schnelle Aktionen
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => {
          const IconComponent = iconMap[link.icon];
          return (
            <Link
              key={link.href}
              href={link.href}
              className="swatch-card bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6
                         flex items-center gap-4 group cursor-pointer hover:border-sage dark:hover:border-dark-primary
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
            >
              <div className="w-10 h-10 rounded-lg bg-sage/10 dark:bg-dark-primary/20 flex items-center justify-center text-sage dark:text-dark-primary shrink-0">
                {IconComponent && <IconComponent className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-ink group-hover:text-sage dark:group-hover:text-dark-primary transition-colors">
                  {link.label}
                </h3>
                <p className="text-sm text-slate-stone">{link.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
