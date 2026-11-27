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

/** @internal — static tournament list, provided to the context */
const TOURNAMENTS: Tournament[] = [
  {
    id: "bambini-cup-2026",
    name: "Bambini-Cup 2026",
    shortName: "Bambini-Cup",
    slug: "bambini-cup-2026",
    status: "upcoming",
    date: "5. Dezember 2026",
    location: "Sporthalle Vilémov",
    teamCount: 10,
    matchCount: 20,
    groupCount: 2,
    invitationUrl: "/flyers/bambini-cup-2026.jpeg",
  },
];

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
      ? (TOURNAMENTS.find((t) => t.slug === activeSlug) ?? null)
      : null;

  return (
    <TournamentContext.Provider
      value={{
        tournaments: TOURNAMENTS,
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
