export default function HeroIcon() {
  return (
    <div className="w-16 h-16 rounded-2xl bg-sage/10 dark:bg-sage/20 flex items-center justify-center mx-auto mb-8">
      <svg
        className="w-9 h-9 text-sage dark:text-dark-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    </div>
  );
}
