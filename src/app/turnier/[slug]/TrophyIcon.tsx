export default function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 15.375V12m0 0V8.625c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125V12m0 0v3.375m0 0h3.375M11.25 12h-6.75m6.75 3.375V15.75"
      />
    </svg>
  );
}
