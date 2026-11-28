import { useState, useCallback, useRef, useEffect } from "react";

export function useGuestToken(slug: string) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const guestUrl = token ? `/g/${token}` : null;

  const loadExistingToken = useCallback(async () => {
    try {
      const res = await fetch(`/api/guest-token?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        if (data.token) setToken(data.token);
      }
    } catch {
      /* No existing token */
    }
  }, [slug]);

  useEffect(() => {
    loadExistingToken();
  }, [loadExistingToken]);

  const handleCreate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/guest-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: "create" }),
      });
      const data = await res.json();
      if (res.ok && data.token) setToken(data.token);
      else if (res.status === 503) setError("Token-Service nicht verfügbar");
      else setError(data.error || "Fehler beim Erstellen");
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const handleShare = useCallback(() => {
    if (!guestUrl) return;
    if (navigator.share) {
      navigator
        .share({
          title: `Link zu ${slug}`,
          url: window.location.origin + guestUrl,
        })
        .catch(() => {});
    }
  }, [guestUrl, slug]);

  const handleClose = useCallback(() => {
    dialogRef.current?.remove();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  return {
    token,
    loading,
    error,
    guestUrl,
    handleCreate,
    handleShare,
    handleClose,
    dialogRef,
  };
}
