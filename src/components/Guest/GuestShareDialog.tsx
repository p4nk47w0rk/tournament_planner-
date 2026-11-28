/**
 * GuestShareDialog — QR-Code & Share Dialog
 *
 * Wird auf der Turnier-Verwaltungsseite angezeigt.
 * Zeigt QR-Code, Share-Button und Token-Rotation.
 *
 * T05: Share-Dialog & QR-Code auf Turnier-Seite
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import QRCode from "react-qr-code";

interface GuestShareDialogProps {
  slug: string;
  tournamentName: string;
}

export default function GuestShareDialog({
  slug,
  tournamentName,
}: GuestShareDialogProps) {
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
        if (data.token) {
          setToken(data.token);
        }
      }
    } catch {
      // No existing token
    }
  }, [slug]);

  // Load existing token on mount
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
      if (res.ok && data.token) {
        setToken(data.token);
      } else if (res.status === 503) {
        setError("Token-Service nicht verfügbar");
      } else {
        setError(data.error || "Fehler beim Erstellen");
      }
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
          title: `Link zu ${tournamentName}`,
          url: window.location.origin + guestUrl,
        })
        .catch(() => {
          // User cancelled share
        });
    }
  }, [guestUrl, tournamentName]);

  const handleClose = useCallback(() => {
    dialogRef.current?.remove();
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Gast-Link & QR-Code"
    >
      <div
        ref={dialogRef}
        className="bg-paper dark:bg-dark-surface rounded-2xl shadow-xl max-w-sm w-full p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-ink dark:text-dark-text">
            Gast-Link &amp; QR-Code
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-dark-surface/50 text-slate-stone"
            aria-label="Schließen"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* QR Code */}
        {guestUrl && (
          <div className="flex flex-col items-center mb-4">
            <div className="bg-white p-4 rounded-xl">
              <QRCode
                value={window.location.origin + guestUrl}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </div>
            <p className="text-xs text-slate-stone mt-3 text-center break-all">
              {window.location.origin + guestUrl}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-3 text-center">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {guestUrl && (
            <>
              <button
                type="button"
                onClick={handleShare}
                className="w-full py-3 px-4 rounded-xl bg-sage text-white font-medium text-sm
                           hover:bg-sage/90 active:bg-sage/80
                           dark:bg-dark-primary dark:hover:bg-dark-primary/90 dark:active:bg-dark-primary/80
                           transition-colors duration-200"
              >
                🔗 Teilen
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="w-full py-3 px-4 rounded-xl border border-slate-hairline dark:border-dark-border
                           text-slate-ink dark:text-dark-text font-medium text-sm
                           hover:bg-slate-50 dark:hover:bg-dark-surface/50
                           transition-colors duration-200"
              >
                Neuen Link erstellen
              </button>
            </>
          )}

          {!guestUrl && !loading && (
            <button
              type="button"
              onClick={handleCreate}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-sage text-white font-medium text-sm
                         hover:bg-sage/90 active:bg-sage/80
                         dark:bg-dark-primary dark:hover:bg-dark-primary/90 dark:active:bg-dark-primary/80
                         transition-colors duration-200 disabled:opacity-50"
            >
              Gast-Link &amp; QR-Code erstellen
            </button>
          )}

          {loading && (
            <div className="flex items-center justify-center py-3">
              <div className="w-5 h-5 border-2 border-sage border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
