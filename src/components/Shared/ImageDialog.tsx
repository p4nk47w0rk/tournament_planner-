"use client";

import {
  useEffect,
  useCallback,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

interface ImageDialogProps {
  src: string;
  alt: string;
  onClose: () => void;
  thumbnailRef?: React.RefObject<HTMLElement | null>;
}

export default function ImageDialog({
  src,
  alt,
  onClose,
  thumbnailRef,
}: ImageDialogProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleClose = useCallback(() => {
    if (isAnimating || isClosing) return;
    setIsClosing(true);
  }, [isAnimating, isClosing]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) handleClose();
    },
    [handleClose]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    },
    [handleClose]
  );

  // --- Open: FLIP from thumbnail ---
  useLayoutEffect(() => {
    const thumbImg = thumbnailRef?.current?.querySelector(
      "img"
    ) as HTMLImageElement | null;
    const img = imgRef.current;

    if (!thumbImg || !img) {
      setIsAnimating(false);
      return;
    }

    const thumbRect = thumbImg.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const targetW = Math.min(vw * 0.9, thumbImg.naturalWidth);
    const targetH = Math.min(vh * 0.85, thumbImg.naturalHeight);

    // Set initial state (thumb position, no transition)
    img.style.transition = "none";
    img.style.position = "fixed";
    img.style.left = `${thumbRect.left}px`;
    img.style.top = `${thumbRect.top}px`;
    img.style.width = `${thumbRect.width}px`;
    img.style.height = `${thumbRect.height}px`;
    img.style.objectFit = "contain";
    img.style.objectPosition = "center";
    img.style.borderRadius = "0.75rem";
    img.style.opacity = "1";
    img.style.zIndex = "100";
    img.style.maxWidth = "none";
    img.style.maxHeight = "none";
    img.style.pointerEvents = "none";
    img.style.backgroundColor = "transparent";

    // Force reflow
    void img.getBoundingClientRect();

    requestAnimationFrame(() => {
      const targetX = (vw - targetW) / 2;
      const targetY = (vh - targetH) / 2;

      img.style.transition = `
        left 400ms cubic-bezier(0.16, 1, 0.3, 1),
        top 400ms cubic-bezier(0.16, 1, 0.3, 1),
        width 400ms cubic-bezier(0.16, 1, 0.3, 1),
        height 400ms cubic-bezier(0.16, 1, 0.3, 1),
        border-radius 400ms cubic-bezier(0.16, 1, 0.3, 1)
      `;
      img.style.left = `${targetX}px`;
      img.style.top = `${targetY}px`;
      img.style.width = `${targetW}px`;
      img.style.height = `${targetH}px`;
      img.style.borderRadius = "0.5rem";
    });

    const timer = setTimeout(() => setIsAnimating(false), 450);
    return () => clearTimeout(timer);
  }, [thumbnailRef]);

  // --- Close: FLIP back to thumbnail ---
  useEffect(() => {
    if (!isClosing || !imgRef.current) return;

    const thumbImg = thumbnailRef?.current?.querySelector(
      "img"
    ) as HTMLImageElement | null;
    const img = imgRef.current;

    if (!thumbImg) {
      onClose();
      return;
    }

    const thumbRect = thumbImg.getBoundingClientRect();

    requestAnimationFrame(() => {
      img.style.transition = `
        left 300ms cubic-bezier(0.55, 0, 1, 0.45),
        top 300ms cubic-bezier(0.55, 0, 1, 0.45),
        width 300ms cubic-bezier(0.55, 0, 1, 0.45),
        height 300ms cubic-bezier(0.55, 0, 1, 0.45),
        border-radius 300ms cubic-bezier(0.55, 0, 1, 0.45)
      `;
      img.style.left = `${thumbRect.left}px`;
      img.style.top = `${thumbRect.top}px`;
      img.style.width = `${thumbRect.width}px`;
      img.style.height = `${thumbRect.height}px`;
      img.style.borderRadius = "0.75rem";
    });

    const timer = setTimeout(onClose, 350);
    return () => clearTimeout(timer);
  }, [isClosing, onClose, thumbnailRef]);

  // --- Keyboard + scroll lock (no layout shift) ---
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Measure current scrollbar width
    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, scrollY);
    };
  }, [handleKeyDown]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          opacity: isClosing ? 0 : 1,
          transition: "opacity 300ms ease",
        }}
      />

      {/* X Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-[60] w-11 h-11 rounded-full bg-white/90 dark:bg-neutral-900/90 shadow-xl shadow-black/30
                   flex items-center justify-center text-slate-600 hover:text-red-600 dark:text-neutral-200 dark:hover:text-red-400
                   hover:bg-white dark:hover:bg-neutral-800 transition-all duration-200"
        style={{
          opacity: isClosing ? 0 : 1,
          transform: isClosing ? "scale(0.8)" : "scale(1)",
          transition: "opacity 250ms ease, transform 250ms ease",
        }}
        aria-label="Schließen"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Image — sharp, above backdrop */}
      <img ref={imgRef} src={src} alt={alt} draggable={false} />
    </div>
  );
}
