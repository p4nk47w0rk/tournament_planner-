"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface SubNav {
  href: string;
  label: string;
}

interface Tournament {
  name: string;
  status?: string;
}

export default function TournamentTabs({
  slug,
  subNavs,
  tournament,
}: {
  slug: string;
  subNavs: SubNav[];
  tournament: Tournament;
}) {
  const pathname = usePathname();

  // Extract the sub-path from the pathname
  const pathSegments = pathname
    .replace(`/turnier/${slug}`, "")
    .split("/")
    .filter(Boolean);
  const activeHref = pathSegments.length > 0 ? `/${pathSegments[0]}` : "";

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 -mb-px">
      {subNavs.map((item) => {
        const href = item.href ? `/${item.href}` : "/";
        const isActive =
          item.href === "" ? activeHref === "/" : activeHref === href;

        return (
          <Link
            key={item.label}
            href={`/turnier/${slug}${href}`}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
              isActive
                ? "border-[#3B5E4D] text-[#3B5E4D] dark:text-dark-primary dark:border-dark-primary"
                : "border-transparent text-slate-stone dark:text-dark-text-secondary hover:text-slate-ink dark:hover:text-dark-text hover:border-slate-300 dark:hover:border-dark-border"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
