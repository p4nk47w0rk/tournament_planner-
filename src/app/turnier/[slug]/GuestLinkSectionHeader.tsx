export function GuestLinkSectionHeader() {
  return (
    <div className="flex items-center gap-3 mb-4">
      <svg
        className="w-6 h-6 text-sage"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="3" height="3" rx="0.5" />
        <path d="M21 14h-4v4" strokeLinecap="round" />
        <path d="M18 21v-4h4" strokeLinecap="round" />
      </svg>
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text">
        Gast-Link &amp; QR-Code
      </h2>
    </div>
  );
}
