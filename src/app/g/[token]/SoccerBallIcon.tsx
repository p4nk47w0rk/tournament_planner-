/**
 * SoccerBallIcon — Inline SVG Icon für Gast-View Header
 *
 * KISS: Nur SVG rendern, keine State/Logic.
 */

export default function SoccerBallIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2 L14.5 8 L12 10 L9.5 8 Z" />
      <path d="M22 12 L16 10 L14.5 12 L16 14 Z" />
      <path d="M12 22 L9.5 16 L12 14 L14.5 16 Z" />
      <path d="M2 12 L8 14 L10 12 L8 10 Z" />
    </svg>
  );
}
