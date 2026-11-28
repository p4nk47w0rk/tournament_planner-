"use client";

import { useImageFlip } from "./useImageFlip";

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
  const {
    isAnimating,
    isClosing,
    overlayRef,
    imgRef,
    handleClose,
    handleBackdropClick,
  } = useImageFlip({ onClose, thumbnailRef });

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <Backdrop isClosing={isClosing} />
      <CloseButton isClosing={isClosing} onClick={handleClose} />
      <img ref={imgRef} src={src} alt={alt} draggable={false} />
    </div>
  );
}

function Backdrop({ isClosing }: { isClosing: boolean }) {
  return (
    <div
      className="absolute inset-0 bg-black/40"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        opacity: isClosing ? 0 : 1,
        transition: "opacity 300ms ease",
      }}
    />
  );
}

function CloseButton({
  isClosing,
  onClick,
}: {
  isClosing: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-[60] w-11 h-11 rounded-full bg-white/90 dark:bg-neutral-900/90 shadow-xl shadow-black/30 flex items-center justify-center text-slate-600 hover:text-red-600 dark:text-neutral-200 dark:hover:text-red-400 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-200"
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
  );
}
