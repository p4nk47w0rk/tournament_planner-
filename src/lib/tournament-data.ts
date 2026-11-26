/**
 * Tournament Data
 * All match data, teams, and groups
 */

export interface Team {
  name: string
  group: 'A' | 'B'
  shortName: string
  color: string
  logo?: string
}

export interface Match {
  id: number
  matchNo: number
  time: string
  pitch: 'A' | 'B'
  group: 'A' | 'B'
  phase: 'group' | 'play_in' | 'quarterfinal' | 'semifinal' | 'final' | 'bronze'
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  status: 'scheduled' | 'live' | 'finished'
  fairplay: boolean
}

export interface StandingsRow {
  team: string
  group: 'A' | 'B'
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  fairplayPoints: number
  rank: number
}

export const TEAMS: Team[] = [
  // Group A
  { name: 'Varnsdorf', group: 'A', shortName: 'VAR', color: 'from-blue-500 to-blue-700' },
  { name: 'Šluknov B', group: 'A', shortName: 'ŠLB', color: 'from-red-500 to-red-700' },
  { name: 'Česká Lípa A', group: 'A', shortName: 'ČLA', color: 'from-green-500 to-green-700' },
  { name: 'Grossharthau', group: 'A', shortName: 'GRH', color: 'from-amber-500 to-amber-700' },
  { name: 'Vilémov', group: 'A', shortName: 'VIL', color: 'from-purple-500 to-purple-700' },

  // Group B
  { name: 'SFA Jiřetín', group: 'B', shortName: 'SFA', color: 'from-orange-500 to-orange-700' },
  { name: 'Neusalza', group: 'B', shortName: 'NEU', color: 'from-teal-500 to-teal-700' },
  { name: 'Šluknov A', group: 'B', shortName: 'SLA', color: 'from-pink-500 to-pink-700' },
  { name: 'Česká Lípa B', group: 'B', shortName: 'CLB', color: 'from-indigo-500 to-indigo-700' },
  { name: 'Union Děčín', group: 'B', shortName: 'UDĚ', color: 'from-cyan-500 to-cyan-700' },
]

export const INITIAL_MATCHES: Match[] = [
  // Group A - 10 matches
  { id: 1, matchNo: 1, time: '09:15', pitch: 'A', group: 'A', phase: 'group', homeTeam: 'Varnsdorf', awayTeam: 'Vilémov', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 3, matchNo: 3, time: '09:30', pitch: 'A', group: 'A', phase: 'group', homeTeam: 'Šluknov B', awayTeam: 'Grossharthau', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 5, matchNo: 5, time: '09:45', pitch: 'A', group: 'A', phase: 'group', homeTeam: 'Varnsdorf', awayTeam: 'Česká Lípa A', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 7, matchNo: 7, time: '10:00', pitch: 'A', group: 'A', phase: 'group', homeTeam: 'Šluknov B', awayTeam: 'Grossharthau', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 9, matchNo: 9, time: '10:15', pitch: 'A', group: 'A', phase: 'group', homeTeam: 'Česká Lípa A', awayTeam: 'Vilémov', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 11, matchNo: 11, time: '10:30', pitch: 'A', group: 'A', phase: 'group', homeTeam: 'Varnsdorf', awayTeam: 'Šluknov B', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 13, matchNo: 13, time: '10:45', pitch: 'A', group: 'A', phase: 'group', homeTeam: 'Česká Lípa A', awayTeam: 'Grossharthau', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 15, matchNo: 15, time: '11:00', pitch: 'A', group: 'A', phase: 'group', homeTeam: 'Šluknov B', awayTeam: 'Vilémov', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 17, matchNo: 17, time: '11:15', pitch: 'A', group: 'A', phase: 'group', homeTeam: 'Varnsdorf', awayTeam: 'Grossharthau', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 19, matchNo: 19, time: '11:30', pitch: 'A', group: 'A', phase: 'group', homeTeam: 'Vilémov', awayTeam: 'Česká Lípa A', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },

  // Group B - 10 matches
  { id: 2, matchNo: 2, time: '09:15', pitch: 'B', group: 'B', phase: 'group', homeTeam: 'SFA Jiřetín', awayTeam: 'Union Děčín', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 4, matchNo: 4, time: '09:30', pitch: 'B', group: 'B', phase: 'group', homeTeam: 'Neusalza', awayTeam: 'Česká Lípa B', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 6, matchNo: 6, time: '09:45', pitch: 'B', group: 'B', phase: 'group', homeTeam: 'SFA Jiřetín', awayTeam: 'Šluknov A', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 8, matchNo: 8, time: '10:00', pitch: 'B', group: 'B', phase: 'group', homeTeam: 'Neusalza', awayTeam: 'Česká Lípa B', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 10, matchNo: 10, time: '10:15', pitch: 'B', group: 'B', phase: 'group', homeTeam: 'Šluknov A', awayTeam: 'Union Děčín', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 12, matchNo: 12, time: '10:30', pitch: 'B', group: 'B', phase: 'group', homeTeam: 'SFA Jiřetín', awayTeam: 'Neusalza', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 14, matchNo: 14, time: '10:45', pitch: 'B', group: 'B', phase: 'group', homeTeam: 'Šluknov A', awayTeam: 'Česká Lípa B', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 16, matchNo: 16, time: '11:00', pitch: 'B', group: 'B', phase: 'group', homeTeam: 'Neusalza', awayTeam: 'Union Děčín', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 18, matchNo: 18, time: '11:15', pitch: 'B', group: 'B', phase: 'group', homeTeam: 'SFA Jiřetín', awayTeam: 'Česká Lípa B', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 20, matchNo: 20, time: '11:30', pitch: 'B', group: 'B', phase: 'group', homeTeam: 'Union Děčín', awayTeam: 'Šluknov A', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
]

export const GROUP_A_TEAMS = ['Varnsdorf', 'Šluknov B', 'Česká Lípa A', 'Grossharthau', 'Vilémov']
export const GROUP_B_TEAMS = ['SFA Jiřetín', 'Neusalza', 'Šluknov A', 'Česká Lípa B', 'Union Děčín']

// ============================================
// Playoff Matches (statisch für MVP)
// ============================================

// Platzhalter-Namen — werden später dynamisch basierend auf Gruppenstand gesetzt
export const PLAYOFF_MATCHES: Match[] = [
  // Play-in
  { id: 21, matchNo: 21, time: '12:15', pitch: 'A', group: 'A', phase: 'play_in', homeTeam: '3. A', awayTeam: '4. A', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 22, matchNo: 22, time: '12:15', pitch: 'B', group: 'B', phase: 'play_in', homeTeam: '3. B', awayTeam: '4. B', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },

  // Viertelfinale
  { id: 23, matchNo: 23, time: '12:45', pitch: 'A', group: 'A', phase: 'quarterfinal', homeTeam: '1. A', awayTeam: 'PI-Winner-2', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 24, matchNo: 24, time: '12:45', pitch: 'B', group: 'B', phase: 'quarterfinal', homeTeam: '2. B', awayTeam: 'PI-Winner-1', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 25, matchNo: 25, time: '13:00', pitch: 'A', group: 'A', phase: 'quarterfinal', homeTeam: '1. B', awayTeam: 'PI-Winner-1', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 26, matchNo: 26, time: '13:00', pitch: 'B', group: 'B', phase: 'quarterfinal', homeTeam: '2. A', awayTeam: 'PI-Winner-2', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },

  // Halbfinale
  { id: 27, matchNo: 27, time: '14:00', pitch: 'A', group: 'A', phase: 'semifinal', homeTeam: 'QF-Winner-1', awayTeam: 'QF-Winner-2', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 28, matchNo: 28, time: '14:00', pitch: 'B', group: 'B', phase: 'semifinal', homeTeam: 'QF-Winner-3', awayTeam: 'QF-Winner-4', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },

  // Finale + Platz 3
  { id: 29, matchNo: 29, time: '15:00', pitch: 'A', group: 'A', phase: 'final', homeTeam: 'SF-Winner-1', awayTeam: 'SF-Winner-2', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
  { id: 30, matchNo: 30, time: '14:30', pitch: 'B', group: 'B', phase: 'bronze', homeTeam: 'SF-Loser-1', awayTeam: 'SF-Loser-2', homeScore: null, awayScore: null, status: 'scheduled', fairplay: false },
]
