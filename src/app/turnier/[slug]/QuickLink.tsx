import Link from "next/link";
import ClipboardIcon from "./ClipboardIcon";
import TrophyIcon from "./TrophyIcon";
import UsersIcon from "./UsersIcon";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  schedule: ClipboardIcon,
  standings: TrophyIcon,
  teams: UsersIcon,
};

interface QuickLinkProps {
  href: string;
  label: string;
  icon: string;
}

export default function QuickLink({ href, label, icon }: QuickLinkProps) {
  const IconComponent = iconMap[icon];
  return (
    <Link
      href={href}
      className="swatch-card bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-5
                 flex items-center gap-3 text-left
                 hover:border-sage dark:hover:border-dark-primary
                 transition-all duration-200 group cursor-pointer"
    >
      <div className="w-8 h-8 rounded-lg bg-sage/10 dark:bg-dark-primary/20 flex items-center justify-center text-sage dark:text-dark-primary">
        {IconComponent && <IconComponent className="w-4 h-4" />}
      </div>
      <span className="font-medium text-slate-ink dark:text-dark-text group-hover:text-sage dark:group-hover:text-dark-primary transition-colors">
        {label}
      </span>
    </Link>
  );
}
