"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { BambiniCupBadge } from "../Shared/BrandSVGs";
import { useTranslations } from "next-intl";
import ImageDialog from "../Shared/ImageDialog";

// Turnierort: Sporthalle Vilémov
const VENUE = {
  lat: 50.9914,
  lng: 14.3326,
  name: "Sporthalle Vilémov",
  address: "Vilémov 84",
};

// Safe client-only execution (SSR guard)
function __safeClient(fn: () => void) {
  if (typeof window !== "undefined") {
    fn();
  }
}

// Leaflet map component
function MapWithEffect() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const initialized = useRef(false);

  // Load Leaflet assets
  if (!leafletReady) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    if (!document.querySelector('[href*="leaflet.css"]')) {
      document.head.appendChild(link);
    }

    const win = window as unknown as Record<string, unknown>;
    if (!win.L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => setLeafletReady(true);
      if (!document.querySelector('[src*="leaflet.js"]')) {
        document.head.appendChild(script);
      } else {
        setLeafletReady(true);
      }
    } else {
      setLeafletReady(true);
    }
  }

  // Initialize map
  __safeClient(() => {
    if (!leafletReady || !mapRef.current || initialized.current) return;
    initialized.current = true;

    const win = window as unknown as Record<string, unknown>;
    const L = win["L"];
    if (!L) return;

    const leaflet = L as any;

    const map = leaflet
      .map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      })
      .setView([VENUE.lat, VENUE.lng], 14);

    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(map);

    // Custom marker
    const markerIcon = leaflet.divIcon({
      html: `<svg width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 28 16 28s16-16 16-28C32 7.163 24.837 0 16 0z" fill="#D97757"/>
        <circle cx="16" cy="16" r="7" fill="white"/>
        <circle cx="16" cy="16" r="4" fill="#D97757"/>
      </svg>`,
      className: "",
      iconSize: [32, 44],
      iconAnchor: [16, 44],
      popupAnchor: [0, -44],
    });

    leaflet
      .marker([VENUE.lat, VENUE.lng], { icon: markerIcon })
      .addTo(map)
      .bindPopup(`<strong>${VENUE.name}</strong><br>${VENUE.address}`);
  });

  return leafletReady ? (
    <div
      ref={mapRef}
      className="w-full h-[280px] rounded-xl overflow-hidden border border-slate-hairline dark:border-slate-hairline"
    />
  ) : (
    <div className="w-full h-[280px] rounded-xl border border-slate-hairline dark:border-slate-hairline flex items-center justify-center bg-muted dark:bg-muted">
      <div className="animate-pulse text-slate-stone text-sm">
        Karte wird geladen...
      </div>
    </div>
  );
}

export default function InfoPage() {
  const t = useTranslations("info");
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const [flyerOpen, setFlyerOpen] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const flyerThumbnailRef = useRef<HTMLButtonElement>(null);

  // Inline tournament data — useTournament() returns empty array because
  // tournament-context is not included in the client JS bundle (SSR issue)
  const tournament: {
    slug: string;
    name: string;
    invitationUrl?: string;
  } | null =
    slug === "bambini-cup-2026"
      ? {
          slug: "bambini-cup-2026",
          name: "Bambini-Cup 2026",
          invitationUrl: "/flyers/bambini-cup-2026.jpeg",
        }
      : null;
  const invitationUrl = tournament?.invitationUrl;

  const handleOpenFlyer = () => {
    const rect = flyerThumbnailRef.current
      ?.querySelector("img")
      ?.getBoundingClientRect();
    if (rect) {
      setFlyerOpen(true);
    }
  };

  const handleRoutePlan = () => {
    const destination = encodeURIComponent(`${VENUE.name}, ${VENUE.address}`);
    const url = userAddress.trim()
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userAddress)}&destination=${destination}`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Page content — no blur, keeps everything sharp */}
      <div className="max-w-4xl mx-auto">
        {/* Einladung / Flyer */}
        {invitationUrl && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-ink text-slate-ink mb-4 flex items-center gap-2">
              📋 {t("invitation")}
            </h2>
            <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6">
              <button
                ref={flyerThumbnailRef}
                onClick={handleOpenFlyer}
                className="cursor-pointer group focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 dark:focus:ring-offset-dark-bg rounded-xl"
                aria-label="Einladung vergrößern"
              >
                <div className="relative w-[250px] overflow-hidden rounded-xl border border-slate-hairline dark:border-slate-hairline transition-shadow duration-200 group-hover:shadow-lg bg-alabaster dark:bg-muted">
                  <img
                    src={invitationUrl}
                    alt={`${tournament?.name ?? ""} Einladung`}
                    className="w-full h-auto object-contain px-4 py-4 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  {/* Overlay hint */}
                  <div className="absolute inset-0 bg-slate-ink/0 group-hover:bg-slate-ink/10 dark:group-hover:bg-dark-text/20 transition-colors duration-200 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-paper/90 dark:bg-paper/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-slate-ink dark:text-dark-text flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                        />
                      </svg>
                      {t("viewFull")}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* Regeln */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-ink text-slate-ink mb-4 flex items-center gap-2">
            ⚽ {t("rules")}
          </h2>
          <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6">
            <ul className="space-y-3">
              {t.raw("rulesItems").map((item: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-slate-stone text-slate-stone"
                >
                  <span className="w-6 h-6 rounded-full bg-sage-mist dark:bg-muted flex items-center justify-center text-xs text-sage-dark text-sage shrink-0 mt-0.5 font-mono">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Verpflegung */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-ink text-slate-ink mb-4 flex items-center gap-2">
            🍕 {t("canteen")}
          </h2>
          <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.raw("canteenItems").map((item: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-slate-stone text-slate-stone"
                >
                  <span className="w-2 h-2 rounded-full bg-terracotta shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Standort mit Karte */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-ink text-slate-ink mb-4 flex items-center gap-2">
            📍 {t("location")}
          </h2>
          <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6 space-y-5">
            {/* Leaflet Map */}
            <MapWithEffect />

            {/* Address */}
            <div>
              <p className="text-sm text-slate-stone text-slate-stone mb-3">
                {VENUE.name} · {VENUE.address}
              </p>

              {/* Route input */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Deine Adresse (optional)"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-hairline dark:border-slate-hairline
                           bg-paper dark:bg-paper text-sm text-slate-ink dark:text-dark-text
                           placeholder:text-slate-stone/50 dark:placeholder:text-slate-stone/40
                           focus:outline-none focus:ring-2 focus:ring-sage dark:focus:ring-sage focus:ring-offset-0"
                  aria-label="Startadresse für Routenplanung"
                />
                <button
                  onClick={handleRoutePlan}
                  disabled={!userAddress.trim()}
                  className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5
                           disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  🗺️ Route planen
                </button>
              </div>

              <p className="text-xs text-slate-stone/70 dark:text-slate-stone/50 mt-2">
                Öffnet Google Maps mit deiner Route zum Turnierort
              </p>
            </div>
          </div>
        </section>

        {/* Veranstalter */}
        <section>
          <h2 className="text-xl font-bold text-slate-ink text-slate-ink mb-4 flex items-center gap-2">
            🏆 {t("organizers")}
          </h2>
          <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src="/logos/vylemov.png"
                alt="SK Stap-Tratec Vilémov Logo"
                className="h-24 w-auto shrink-0 rounded-lg"
              />
              <div className="flex-1 space-y-3 text-sm text-slate-stone text-slate-stone">
                <div className="flex justify-between py-2 border-b border-slate-hairline dark:border-slate-hairline">
                  <span>Veranstalter</span>
                  <span className="font-medium text-slate-ink text-slate-ink">
                    SK Stap-Tratec Vilémov
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-hairline dark:border-slate-hairline">
                  <span>Turniersteuerung</span>
                  <span className="font-medium text-slate-ink text-slate-ink">
                    L. Sklenář
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Website</span>
                  <a
                    href="https://skvilemov.cz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sage text-sage hover:underline"
                  >
                    skvilemov.cz
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flyer Lightbox */}
        {flyerOpen && invitationUrl && (
          <ImageDialog
            src={invitationUrl}
            alt={`${tournament?.name ?? ""} Einladung`}
            onClose={() => setFlyerOpen(false)}
            thumbnailRef={flyerThumbnailRef}
          />
        )}
      </div>
    </>
  );
}
