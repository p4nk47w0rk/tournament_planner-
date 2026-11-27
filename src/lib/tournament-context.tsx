"use client";

import { createContext, useContext, useState, useCallback } from "react";

export interface Tournament {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  status: "upcoming" | "live" | "finished";
  date: string;
  location: string;
  teamCount: number;
  matchCount: number;
  groupCount: number;
  invitationUrl?: string;
}

export const TOURNAMENT_SLUGS = ["bambini-cup-2026"] as const;
export type TournamentSlug = (typeof TOURNAMENT_SLUGS)[number];

export const TOURNAMENT_METADATA: Record<
  TournamentSlug,
  Omit<Tournament, "slug">
> = {
  "bambini-cup-2026": {
    id: "bambini-cup-2026",
    name: "Bambini-Cup 2026",
    shortName: "Bambini-Cup",
    status: "upcoming" as const,
    date: "5. Dezember 2026",
    location: "Sporthalle Vilémov",
    teamCount: 10,
    matchCount: 20,
    groupCount: 2,
    invitationUrl: "/flyers/bambini-cup-2026.jpeg",
  },
};

function getTournaments(slugs: readonly TournamentSlug[]): Tournament[] {
  return slugs.map((slug) => ({ ...TOURNAMENT_METADATA[slug], slug }));
}

interface TournamentContextValue {
  tournaments: Tournament[];
  activeTournament: Tournament | null;
  setActiveTournament: (slug: string) => void;
  activeSlug: string | null;
}

const TournamentContext = createContext<TournamentContextValue>({
  tournaments: [],
  activeTournament: null,
  setActiveTournament: () => {},
  activeSlug: null,
});

export function TournamentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const setActiveTournament = useCallback((slug: string) => {
    setActiveSlug(slug);
  }, []);

  const activeTournament =
    activeSlug && typeof window !== "undefined"
      ? (getTournaments(TOURNAMENT_SLUGS).find((t) => t.slug === activeSlug) ??
        null)
      : null;

  return (
    <TournamentContext.Provider
      value={{
        tournaments: getTournaments(TOURNAMENT_SLUGS),
        activeTournament,
        setActiveTournament,
        activeSlug,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  return useContext(TournamentContext);
}

export function useActiveTournament() {
  const ctx = useContext(TournamentContext);
  if (!ctx.activeSlug) {
    throw new Error(
      "useActiveTournament must be used within a tournament context"
    );
  }
  return ctx.activeTournament!;
}
