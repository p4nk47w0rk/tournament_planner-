import {
  useEffect,
  useCallback,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

interface UseImageFlipOptions {
  onClose: () => void;
  thumbnailRef?: React.RefObject<HTMLElement | null>;
}

export function useImageFlip({ onClose, thumbnailRef }: UseImageFlipOptions) {
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

  // FLIP open animation
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

    setInitialPosition(img, thumbRect);
    void img.getBoundingClientRect();

    requestAnimationFrame(() => {
      applyTargetPosition(img, thumbRect, { w: targetW, h: targetH, vw, vh });
    });

    const timer = setTimeout(() => setIsAnimating(false), 450);
    return () => clearTimeout(timer);
  }, [thumbnailRef]);

  // FLIP close animation
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
      animateBack(img, thumbRect);
    });
    const timer = setTimeout(onClose, 350);
    return () => clearTimeout(timer);
  }, [isClosing, onClose, thumbnailRef]);

  // Keyboard + scroll lock
  useLockDocument(handleClose);

  return {
    isAnimating,
    isClosing,
    overlayRef,
    imgRef,
    handleClose,
    handleBackdropClick,
  };
}

function useLockDocument(onClose: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
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
  }, [onClose]);
}

function setInitialPosition(img: HTMLImageElement, rect: DOMRect) {
  img.style.transition = "none";
  img.style.position = "fixed";
  img.style.left = `${rect.left}px`;
  img.style.top = `${rect.top}px`;
  img.style.width = `${rect.width}px`;
  img.style.height = `${rect.height}px`;
  img.style.objectFit = "contain";
  img.style.objectPosition = "center";
  img.style.borderRadius = "0.75rem";
  img.style.opacity = "1";
  img.style.zIndex = "100";
  img.style.maxWidth = "none";
  img.style.maxHeight = "none";
  img.style.pointerEvents = "none";
  img.style.backgroundColor = "transparent";
}

function applyTargetPosition(
  img: HTMLImageElement,
  rect: DOMRect,
  target: { w: number; h: number; vw: number; vh: number }
) {
  const { w: targetW, h: targetH, vw, vh } = target;
  const targetX = (vw - targetW) / 2;
  const targetY = (vh - targetH) / 2;
  img.style.transition =
    "left 400ms cubic-bezier(0.16, 1, 0.3, 1), top 400ms cubic-bezier(0.16, 1, 0.3, 1), width 400ms cubic-bezier(0.16, 1, 0.3, 1), height 400ms cubic-bezier(0.16, 1, 0.3, 1), border-radius 400ms cubic-bezier(0.16, 1, 0.3, 1)";
  img.style.left = `${targetX}px`;
  img.style.top = `${targetY}px`;
  img.style.width = `${targetW}px`;
  img.style.height = `${targetH}px`;
  img.style.borderRadius = "0.5rem";
}

function animateBack(img: HTMLImageElement, rect: DOMRect) {
  img.style.transition =
    "left 300ms cubic-bezier(0.55, 0, 1, 0.45), top 300ms cubic-bezier(0.55, 0, 1, 0.45), width 300ms cubic-bezier(0.55, 0, 1, 0.45), height 300ms cubic-bezier(0.55, 0, 1, 0.45), border-radius 300ms cubic-bezier(0.55, 0, 1, 0.45)";
  img.style.left = `${rect.left}px`;
  img.style.top = `${rect.top}px`;
  img.style.width = `${rect.width}px`;
  img.style.height = `${rect.height}px`;
  img.style.borderRadius = "0.75rem";
}
