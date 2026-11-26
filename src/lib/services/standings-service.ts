/**
 * Standings-Service
 *
 * Berechnet die Gruppenstand-Tabelle automatisch aus den Spiel-Ergebnissen.
 * Pure Function — keine Side Effects.
 */

import type {Match, StandingsRow} from '@/lib/types'

export class StandingsService {
  /**
   * Calculate standings from matches
   *
   * Sorting: points (desc) → goalDifference (desc) → goalsFor (desc)
   */
  static calculateStandings(matches: Match[]): StandingsRow[] {
    // Initialize stats for all teams
    const stats = new Map<string, {
      played: number
      won: number
      drawn: number
      lost: number
      goalsFor: number
      goalsAgainst: number
      group: 'A' | 'B'
    }>()

    // First pass: get all teams and their groups
    for (const match of matches) {
      if (!stats.has(match.homeTeam)) {
        stats.set(match.homeTeam, {played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, group: match.group})
      }
      if (!stats.has(match.awayTeam)) {
        stats.set(match.awayTeam, {played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, group: match.group})
      }
    }

    // Second pass: update stats from matches with scores
    for (const match of matches) {
      if (match.homeScore === null || match.awayScore === null) continue

      const home = stats.get(match.homeTeam)!
      const away = stats.get(match.awayTeam)!

      // Update played
      home.played++
      away.played++

      // Update goals
      home.goalsFor += match.homeScore
      home.goalsAgainst += match.awayScore
      away.goalsFor += match.awayScore
      away.goalsAgainst += match.homeScore

      // Update win/draw/loss
      if (match.homeScore > match.awayScore) {
        home.won++
        away.lost++
      } else if (match.homeScore < match.awayScore) {
        away.won++
        home.lost++
      } else {
        home.drawn++
        away.drawn++
      }
    }

    // Convert to StandingsRow and calculate derived stats
    const rows: StandingsRow[] = []
    let rank = 1

    for (const [team, stat] of stats) {
      const goalDifference = stat.goalsFor - stat.goalsAgainst
      const points = stat.won * 3 + stat.drawn

      rows.push({
        team,
        group: stat.group,
        played: stat.played,
        won: stat.won,
        drawn: stat.drawn,
        lost: stat.lost,
        goalsFor: stat.goalsFor,
        goalsAgainst: stat.goalsAgainst,
        goalDifference: goalDifference,
        points,
        fairplayPoints: 0, // TODO: calculate from matches
        rank: null, // Will be set after sorting
      })
    }

    // Sort: points → GD → goalsFor
    rows.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })

    // Assign ranks
    for (let i = 0; i < rows.length; i++) {
      rows[i].rank = i + 1
    }

    return rows
  }

  /**
   * Get standings for a specific group
   */
  static getGroupStandings(matches: Match[], group: 'A' | 'B'): StandingsRow[] {
    const all = this.calculateStandings(matches)
    return all.filter((row) => row.group === group)
  }

  // ============================================
  // Unit Test Helpers
  // ============================================

  /**
   * Create a simple test match
   */
  static createTestMatch(
    id: number,
    home: string,
    away: string,
    homeScore: number,
    awayScore: number,
    group: 'A' | 'B' = 'A',
    pitch: 'A' | 'B' = 'A'
  ): Match {
    return {
      id,
      matchNo: id,
      time: '12:00',
      pitch,
      group,
      phase: 'group',
      homeTeam: home,
      awayTeam: away,
      homeScore,
      awayScore,
      status: 'finished',
      fairplay: false,
    }
  }
}
