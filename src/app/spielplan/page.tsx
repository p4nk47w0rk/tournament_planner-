'use client'

import {useTranslations} from 'next-intl'
import MatchCard from '@/components/Spielplan/MatchCard'
import PlayoffBracket from '@/components/Spielplan/PlayoffBracket'
import {INITIAL_MATCHES, PLAYOFF_MATCHES, type Match} from '@/lib/tournament-data'
import {useState, useMemo, useCallback} from 'react'
import {MatchService} from '@/lib/services/match-service'
import {GoalService} from '@/lib/services/goal-service'

type Tab = 'all' | 'A' | 'B' | 'playoffs'
type FilterTeam = 'all' | string

export default function SchedulePage() {
  const t = useTranslations('schedule')

  // Local state for MVP (static matches)
  // In V2, this will come from Supabase
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES)
  const [playoffMatches, setPlayoffMatches] = useState<Match[]>(PLAYOFF_MATCHES)
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [filterTeam, setFilterTeam] = useState<FilterTeam>('all')

  // Check edit mode from localStorage
  const [editable, setEditable] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('edit-mode') === 'true'
    }
    return false
  })

  const handleScoreChange = useCallback(async (matchId: number, team: 'home' | 'away', delta: number) => {
    // Optimistic update
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m
        const currentScore = team === 'home' ? (m.homeScore ?? 0) : (m.awayScore ?? 0)
        const newScore = Math.max(0, currentScore + delta)
        return {
          ...m,
          homeScore: team === 'home' ? newScore : m.homeScore,
          awayScore: team === 'away' ? newScore : m.awayScore,
        }
      })
    )

    // Save to Supabase (with fallback)
    try {
      const match = matches.find((m) => m.id === matchId)
      if (match) {
        const newHome = team === 'home' ? (match.homeScore ?? 0) + delta : match.homeScore
        const newAway = team === 'away' ? (match.awayScore ?? 0) + delta : match.awayScore
        await MatchService.updateScore(matchId, newHome ?? 0, newAway ?? 0)
      }
    } catch (err) {
      console.warn('Failed to save score to Supabase, using local state:', err)
    }
  }, [matches])

  const handleGoalAdd = useCallback(async (matchId: number, team: string, minute?: string, player?: string) => {
    try {
      await GoalService.addGoal(matchId, team, minute, player)
    } catch (err) {
      console.warn('Failed to save goal to Supabase:', err)
    }
  }, [])

  const filteredMatches = useMemo(() => {
    let filtered = [...matches]

    if (activeTab === 'A') filtered = filtered.filter((m) => m.group === 'A')
    else if (activeTab === 'B') filtered = filtered.filter((m) => m.group === 'B')

    if (filterTeam !== 'all') {
      filtered = filtered.filter((m) => m.homeTeam === filterTeam || m.awayTeam === filterTeam)
    }

    return filtered.sort((a, b) => a.time.localeCompare(b.time))
  }, [matches, activeTab, filterTeam])

  const allTeamNames = useMemo(() => {
    const names = new Set<string>()
    matches.forEach((m) => {
      names.add(m.homeTeam)
      names.add(m.awayTeam)
    })
    return Array.from(names).sort()
  }, [matches])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text">{t('title')}</h1>

        {/* Edit toggle */}
        <button
          onClick={() => setEditable(!editable)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            editable
              ? 'bg-green-600 text-white'
              : 'bg-slate-100 dark:bg-dark-secondary text-slate-600 dark:text-dark-text-secondary hover:bg-slate-200 dark:hover:bg-dark-border'
          }`}
        >
          {editable ? '✏️ Edit-Mode' : '👁 View-Mode'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          {t('all')}
        </TabButton>
        <TabButton active={activeTab === 'A'} onClick={() => setActiveTab('A')}>
          {t('groupA')}
        </TabButton>
        <TabButton active={activeTab === 'B'} onClick={() => setActiveTab('B')}>
          {t('groupB')}
        </TabButton>
        <TabButton active={activeTab === 'playoffs'} onClick={() => setActiveTab('playoffs')}>
          {t('playoffs')}
        </TabButton>
      </div>

      {/* Team filter */}
      <div className="mb-6">
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="w-full sm:w-64 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-dark-border
                     bg-white dark:bg-dark-card text-sm text-slate-900 dark:text-dark-text
                     focus:outline-none focus:ring-2 focus:ring-[#3B5E4D]"
        >
          <option value="all">{t('filter')}: {t('all')}</option>
          {allTeamNames.map((team) => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      {/* Playoff Bracket */}
      {activeTab === 'playoffs' && (
        <PlayoffBracket
          matches={playoffMatches}
          editable={editable}
          onScoreChange={handleScoreChange}
          onGoalAdd={handleGoalAdd}
        />
      )}

      {/* Group matches */}
      {activeTab !== 'playoffs' && (
        <div className="space-y-3">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onScoreChange={editable ? handleScoreChange : undefined}
              onGoalAdd={editable ? handleGoalAdd : undefined}
              editable={editable}
            />
          ))}
          {filteredMatches.length === 0 && (
            <div className="text-center py-12 text-slate-stone dark:text-dark-text-secondary">
              Keine Spiele gefunden.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TabButton({active, onClick, children}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200
        ${active
          ? 'bg-[#3B5E4D] text-white'
          : 'text-slate-stone dark:text-dark-text-secondary hover:text-slate-ink dark:hover:text-dark-text hover:bg-slate-100 dark:hover:bg-dark-border'
        }`}
    >
      {children}
    </button>
  )
}
