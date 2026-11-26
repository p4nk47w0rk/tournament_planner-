'use client'

import {useEffect, useState, useCallback} from 'react'
import {type Match, type StandingsRow} from '@/lib/types'
import {MatchService} from '@/lib/services/match-service'
import {StandingsService} from '@/lib/services/standings-service'

interface StandingsTableProps {
  group: 'A' | 'B'
}

export default function StandingsTable({group}: StandingsTableProps) {
  const [standings, setStandings] = useState<StandingsRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStandings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const matches = await MatchService.getAllMatches()
      const standingsData = StandingsService.getGroupStandings(matches, group)
      setStandings(standingsData)
    } catch (err) {
      console.error('Failed to load standings:', err)
      setError('Fehler beim Laden der Tabelle')
    } finally {
      setLoading(false)
    }
  }, [group])

  // Initial load
  useEffect(() => {
    loadStandings()
  }, [loadStandings])

  // Subscribe to realtime updates
  useEffect(() => {
    const unsubscribe = MatchService.subscribeToAll(() => {
      loadStandings()
    })
    return unsubscribe
  }, [loadStandings])

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card p-8">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-dark-secondary rounded w-1/4" />
          <div className="h-32 bg-slate-100 dark:bg-dark-secondary rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" role="table" aria-label={`Gruppenstand Gruppe ${group}`}>
        <thead>
          <tr className="border-b border-slate-200 dark:border-dark-border">
            <th className="py-3 px-2 text-center font-semibold text-slate-600 dark:text-dark-text-secondary w-10">#</th>
            <th className="py-3 px-2 text-left font-semibold text-slate-900 dark:text-dark-text">Team</th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 dark:text-dark-text-secondary hidden sm:table-cell">Sp</th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 dark:text-dark-text-secondary hidden sm:table-cell">S</th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 dark:text-dark-text-secondary hidden md:table-cell">U</th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 dark:text-dark-text-secondary hidden sm:table-cell">N</th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 dark:text-dark-text-secondary">Tore</th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 dark:text-dark-text-secondary">TD</th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 dark:text-dark-text-secondary">Pkt</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr
              key={row.team}
              className={`border-b border-slate-100 dark:border-dark-border transition-colors ${
                row.rank! <= 2
                  ? 'bg-green-50/50 dark:bg-green-900/10'
                  : ''
              } hover:bg-slate-50 dark:hover:bg-dark-secondary/50`}
            >
              <td className="py-3 px-2 text-center font-bold text-slate-900 dark:text-dark-text">
                {row.rank}
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  {row.rank! <= 2 && (
                    <span className="w-2 h-2 rounded-full bg-green-500" title="Playoff-Platz" />
                  )}
                  <span className="font-medium text-slate-900 dark:text-dark-text">{row.team}</span>
                </div>
              </td>
              <td className="py-3 px-2 text-center text-slate-600 dark:text-dark-text-secondary hidden sm:table-cell">
                {row.played}
              </td>
              <td className="py-3 px-2 text-center text-slate-600 dark:text-dark-text-secondary hidden sm:table-cell">
                {row.won}
              </td>
              <td className="py-3 px-2 text-center text-slate-600 dark:text-dark-text-secondary hidden md:table-cell">
                {row.drawn}
              </td>
              <td className="py-3 px-2 text-center text-slate-600 dark:text-dark-text-secondary hidden sm:table-cell">
                {row.lost}
              </td>
              <td className="py-3 px-2 text-center font-mono text-slate-700 dark:text-dark-text">
                {row.goalsFor}:{row.goalsAgainst}
              </td>
              <td className="py-3 px-2 text-center font-mono font-medium text-slate-700 dark:text-dark-text">
                {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
              </td>
              <td className="py-3 px-2 text-center font-bold text-slate-900 dark:text-dark-text">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
