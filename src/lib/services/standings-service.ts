/**
 * Standings-Service
 *
 * Berechnet die Gruppenstand-Tabelle automatisch aus den Spiel-Ergebnissen.
 * Pure Function — keine Side Effects.
 */

import type { Match, StandingsRow } from "@/lib/types";
import { TEAMS } from "@/lib/tournament-data";

interface TeamStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  group: "A" | "B";
}

function createEmptyStats(group: "A" | "B"): TeamStats {
  return {
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    group,
  };
}

function getOrCreateTeam(
  stats: Map<string, TeamStats>,
  name: string,
  group: "A" | "B"
): TeamStats {
  if (!stats.has(name)) {
    stats.set(name, createEmptyStats(group));
  }
  return stats.get(name)!;
}

function applyMatchResult(
  home: TeamStats,
  away: TeamStats,
  homeScore: number,
  awayScore: number
) {
  home.played++;
  away.played++;

  home.goalsFor += homeScore;
  home.goalsAgainst += awayScore;
  away.goalsFor += awayScore;
  away.goalsAgainst += homeScore;

  if (homeScore > awayScore) {
    home.won++;
    away.lost++;
  } else if (homeScore < awayScore) {
    away.won++;
    home.lost++;
  } else {
    home.drawn++;
    away.drawn++;
  }
}

export class StandingsService {
  /**
   * Calculate standings from matches
   *
   * Sorting: points (desc) → goalDifference (desc) → goalsFor (desc)
   */
  static calculateStandings(matches: Match[]): StandingsRow[] {
    const stats = new Map<string, TeamStats>();

    // First pass: register all teams and their groups
    for (const match of matches) {
      getOrCreateTeam(stats, match.homeTeam, match.group);
      getOrCreateTeam(stats, match.awayTeam, match.group);
    }

    // Second pass: compute stats from finished matches
    for (const match of matches) {
      if (match.homeScore === null || match.awayScore === null) continue;

      const home = stats.get(match.homeTeam)!;
      const away = stats.get(match.awayTeam)!;

      applyMatchResult(home, away, match.homeScore, match.awayScore);
    }

    // Convert to StandingsRow and calculate derived stats
    const rows: StandingsRow[] = [];

    for (const [team, stat] of stats) {
      const teamInfo = TEAMS.find((t) => t.name === team);
      rows.push({
        team,
        group: stat.group,
        played: stat.played,
        won: stat.won,
        drawn: stat.drawn,
        lost: stat.lost,
        goalsFor: stat.goalsFor,
        goalsAgainst: stat.goalsAgainst,
        goalDifference: stat.goalsFor - stat.goalsAgainst,
        points: stat.won * 3 + stat.drawn,
        fairplayPoints: 0,
        rank: null,
        logo: teamInfo?.logo,
      });
    }

    // Sort: points → GD → goalsFor
    rows.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference)
        return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    // Assign ranks
    for (const [i, row] of rows.entries()) {
      row.rank = i + 1;
    }

    // Filter out teams that haven't played
    return rows.filter((row) => row.played > 0);
  }

  /**
   * Get standings for a specific group
   */
  static getGroupStandings(matches: Match[], group: "A" | "B"): StandingsRow[] {
    const all = this.calculateStandings(matches);
    return all.filter((row) => row.group === group);
  }

  // ============================================
  // Unit Test Helpers
  // ============================================

  /**
   * Create a simple test match
   */
  static createTestMatch(
    id: number,
    teams: { home: string; away: string },
    scores: { home: number; away: number },
    options?: { group?: "A" | "B"; pitch?: "A" | "B" }
  ): Match {
    const { home, away } = teams;
    const { home: homeScore, away: awayScore } = scores;
    const { group = "A", pitch = "A" } = options ?? {};
    return {
      id,
      matchNo: id,
      time: "12:00",
      pitch,
      group,
      phase: "group",
      homeTeam: home,
      awayTeam: away,
      homeScore,
      awayScore,
      status: "finished",
      fairplay: false,
    };
  }
}
