"use client";

/**
 * Brand SVGs as inline React components.
 * Inlining enables proper dark-mode color adaptation and avoids
 * the @next/next/no-img-element lint warning.
 */

/* ── Icon (navbar, favicons) ─────────────────────────── */
export function TPIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <g
        stroke="#3B5E4D"
        strokeWidth="7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M36 44 H116" />
        <path d="M36 44 V156 H148 V96" />
        <path d="M36 74 H68 V106" />
        <path d="M36 126 H78 V156" />
        <path d="M104 156 V126 H148" />
        <path d="M68 106 H96" />
      </g>
      <g fill="#D97757">
        <polygon points="84,104 114,74 120,80 90,110" />
        <polygon points="96,116 126,86 132,92 102,122" />
        <polygon points="108,128 138,98 144,104 114,134" />
      </g>
      <g transform="translate(136, 64)">
        <circle cx="0" cy="0" r="30" fill="#D97757" />
        <polygon points="0,-11 10,-3 6,9 -6,9 -10,-3" fill="#F7F6F2" />
        <line
          x1="0"
          y1="-11"
          x2="0"
          y2="-28"
          stroke="#F7F6F2"
          strokeWidth="3.5"
        />
        <line
          x1="10"
          y1="-3"
          x2="26"
          y2="-8"
          stroke="#F7F6F2"
          strokeWidth="3.5"
        />
        <line
          x1="6"
          y1="9"
          x2="17"
          y2="23"
          stroke="#F7F6F2"
          strokeWidth="3.5"
        />
        <line
          x1="-6"
          y1="9"
          x2="-17"
          y2="23"
          stroke="#F7F6F2"
          strokeWidth="3.5"
        />
        <line
          x1="-10"
          y1="-3"
          x2="-26"
          y2="-8"
          stroke="#F7F6F2"
          strokeWidth="3.5"
        />
      </g>
    </svg>
  );
}

/* ── Wordmark — light (white bg) ─────────────────────── */
export function TPWordmarkLight({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 560 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <g transform="translate(10, 8) scale(0.52)">
        <g
          stroke="#3B5E4D"
          strokeWidth="8"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <path d="M36 44 H116" />
          <path d="M36 44 V156 H148 V96" />
          <path d="M36 74 H68 V106" />
          <path d="M36 126 H78 V156" />
          <path d="M104 156 V126 H148" />
          <path d="M68 106 H96" />
        </g>
        <g fill="#D97757">
          <polygon points="84,104 114,74 120,80 90,110" />
          <polygon points="96,116 126,86 132,92 102,122" />
          <polygon points="108,128 138,98 144,104 114,134" />
        </g>
        <g transform="translate(136, 64)">
          <circle cx="0" cy="0" r="30" fill="#D97757" />
          <polygon points="0,-11 10,-3 6,9 -6,9 -10,-3" fill="#F7F6F2" />
          <line
            x1="0"
            y1="-11"
            x2="0"
            y2="-28"
            stroke="#F7F6F2"
            strokeWidth="3.5"
          />
          <line
            x1="10"
            y1="-3"
            x2="26"
            y2="-8"
            stroke="#F7F6F2"
            strokeWidth="3.5"
          />
          <line
            x1="6"
            y1="9"
            x2="17"
            y2="23"
            stroke="#F7F6F2"
            strokeWidth="3.5"
          />
          <line
            x1="-6"
            y1="9"
            x2="-17"
            y2="23"
            stroke="#F7F6F2"
            strokeWidth="3.5"
          />
          <line
            x1="-10"
            y1="-3"
            x2="-26"
            y2="-8"
            stroke="#F7F6F2"
            strokeWidth="3.5"
          />
        </g>
      </g>
      <text
        x="128"
        y="72"
        fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="36"
        fontWeight="700"
        letterSpacing="-0.03em"
        fill="#1C2420"
      >
        Tournament <tspan fill="#3B5E4D">Planner</tspan>
      </text>
    </svg>
  );
}

/* ── Wordmark — dark (dark bg) ───────────────────────── */
export function TPWordmarkDark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 560 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <g transform="translate(10, 8) scale(0.52)">
        <g
          stroke="#8FB8A3"
          strokeWidth="8"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <path d="M36 44 H116" />
          <path d="M36 44 V156 H148 V96" />
          <path d="M36 74 H68 V106" />
          <path d="M36 126 H78 V156" />
          <path d="M104 156 V126 H148" />
          <path d="M68 106 H96" />
        </g>
        <g fill="#E58B6D">
          <polygon points="84,104 114,74 120,80 90,110" />
          <polygon points="96,116 126,86 132,92 102,122" />
          <polygon points="108,128 138,98 144,104 114,134" />
        </g>
        <g transform="translate(136, 64)">
          <circle cx="0" cy="0" r="30" fill="#E58B6D" />
          <polygon points="0,-11 10,-3 6,9 -6,9 -10,-3" fill="#1C2420" />
          <line
            x1="0"
            y1="-11"
            x2="0"
            y2="-28"
            stroke="#1C2420"
            strokeWidth="3.5"
          />
          <line
            x1="10"
            y1="-3"
            x2="26"
            y2="-8"
            stroke="#1C2420"
            strokeWidth="3.5"
          />
          <line
            x1="6"
            y1="9"
            x2="17"
            y2="23"
            stroke="#1C2420"
            strokeWidth="3.5"
          />
          <line
            x1="-6"
            y1="9"
            x2="-17"
            y2="23"
            stroke="#1C2420"
            strokeWidth="3.5"
          />
          <line
            x1="-10"
            y1="-3"
            x2="-26"
            y2="-8"
            stroke="#1C2420"
            strokeWidth="3.5"
          />
        </g>
      </g>
      <text
        x="128"
        y="72"
        fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="36"
        fontWeight="700"
        letterSpacing="-0.03em"
        fill="#F7F6F2"
      >
        Tournament <tspan fill="#8FB8A3">Planner</tspan>
      </text>
    </svg>
  );
}

/* ── Bambini-Cup Event Badge ─────────────────────────── */
export function BambiniCupBadge({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <rect
        x="2"
        y="2"
        width="356"
        height="116"
        rx="16"
        fill="#F7F6F2"
        stroke="#3B5E4D"
        strokeWidth="2"
      />
      <circle cx="60" cy="60" r="34" fill="#D97757" />
      <polygon points="60,44 74,54 69,71 51,71 46,54" fill="#F7F6F2" />
      <line x1="60" y1="44" x2="60" y2="26" stroke="#F7F6F2" strokeWidth="3" />
      <line x1="74" y1="54" x2="92" y2="48" stroke="#F7F6F2" strokeWidth="3" />
      <line x1="69" y1="71" x2="80" y2="87" stroke="#F7F6F2" strokeWidth="3" />
      <line x1="51" y1="71" x2="40" y2="87" stroke="#F7F6F2" strokeWidth="3" />
      <line x1="46" y1="54" x2="28" y2="48" stroke="#F7F6F2" strokeWidth="3" />
      <text
        x="112"
        y="54"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontSize="24"
        fontWeight="800"
        letterSpacing="-0.02em"
        fill="#1C2420"
      >
        BAMBINI-CUP <tspan fill="#D97757">2026</tspan>
      </text>
      <text
        x="112"
        y="80"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="12"
        fontWeight="600"
        letterSpacing="0.08em"
        fill="#3B5E4D"
      >
        VILÉMOV
      </text>
    </svg>
  );
}

/* ── SV Fortschritt Club Badge ───────────────────────── */
export function SVClubBadge({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 280"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <path
        d="M24 20 H216 V145 C216 205 120 260 120 260 C120 260 24 205 24 145 Z"
        fill="#3B5E4D"
        stroke="#1C2420"
        strokeWidth="6"
      />
      <path
        d="M36 32 H204 V142 C204 194 120 244 120 244 C120 244 36 194 36 142 Z"
        stroke="#E2B86B"
        strokeWidth="2.5"
      />
      <path
        d="M62 128 L120 82 L178 128"
        stroke="#F7F6F2"
        strokeWidth="10"
        strokeLinecap="square"
      />
      <path
        d="M78 156 L120 122 L162 156"
        stroke="#E2B86B"
        strokeWidth="7"
        strokeLinecap="square"
      />
      <circle cx="120" cy="192" r="22" fill="#F7F6F2" />
      <polygon
        points="120,182 129,189 125,200 115,200 111,189"
        fill="#3B5E4D"
      />
      <text
        x="120"
        y="64"
        textAnchor="middle"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontSize="18"
        fontWeight="800"
        letterSpacing="0.14em"
        fill="#F7F6F2"
      >
        SV FORTSCHRITT
      </text>
      <text
        x="120"
        y="232"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="11"
        fontWeight="700"
        letterSpacing="0.16em"
        fill="#E2B86B"
      >
        GROSSHARTHAU
      </text>
    </svg>
  );
}
