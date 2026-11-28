/**
 * CollapsibleSection — Akkordeon-Container
 *
 * Small, reusable component with smooth height transition.
 * ≤ 60 Zeilen — KISS.
 */

import { useEffect, useRef, useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.style.maxHeight = isOpen ? `${el.scrollHeight}px` : "0px";
  }, [isOpen]);

  return (
    <div className="border-b border-slate-hairline dark:border-dark-border">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-4 px-4 text-left"
        aria-expanded={isOpen}
      >
        <h2 className="text-base font-semibold text-slate-ink dark:text-dark-text">
          {title}
        </h2>
        <svg
          className={`w-5 h-5 text-slate-stone transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{
          maxHeight: "0px",
          transition: "max-height 0.3s ease",
        }}
      >
        <div className="pb-4 px-4">{children}</div>
      </div>
    </div>
  );
}
