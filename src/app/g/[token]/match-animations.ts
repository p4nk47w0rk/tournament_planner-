/**
 * match-animations — Pure Web Animations API helpers
 *
 * KISS: Keine React-Abhängigkeiten, leicht testbar.
 */

export function animatePulse(element: HTMLElement | null, color: string) {
  if (!element) return;
  element.animate(
    [
      { boxShadow: `0 0 0 0 ${color}`, opacity: 1 },
      { boxShadow: `0 0 0 8px ${color}40`, opacity: 0.7 },
      { boxShadow: `0 0 0 0 ${color}`, opacity: 1 },
    ],
    { duration: 800, easing: "ease-out" }
  );
}

export function animateFlash(element: HTMLElement | null) {
  if (!element) return;
  element.animate(
    [
      { color: "var(--text)", fontWeight: 400 },
      { color: "var(--accent)", fontWeight: 700 },
      { color: "var(--text)", fontWeight: 400 },
    ],
    { duration: 600, easing: "ease-out" }
  );
}
