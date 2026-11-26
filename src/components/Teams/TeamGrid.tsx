'use client'

import {useTranslations} from 'next-intl'
import {TEAMS, type Team} from '@/lib/tournament-data'
import {useState} from 'react'

export default function TeamGrid() {
  const t = useTranslations('teams')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  const groupA = TEAMS.filter((t) => t.group === 'A')
  const groupB = TEAMS.filter((t) => t.group === 'B')

  return (
    <div className="space-y-12">
      {/* Group A */}
      <div>
        <h2 className="text-2xl font-bold text-slate-ink dark:text-dark-text mb-6">
          {t('groupA')} · {t('pitch')} A
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {groupA.map((team) => (
            <TeamCard key={team.name} team={team} onClick={() => setSelectedTeam(team)} />
          ))}
        </div>
      </div>

      {/* Group B */}
      <div>
        <h2 className="text-2xl font-bold text-slate-ink dark:text-dark-text mb-6">
          {t('groupB')} · {t('pitch')} B
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {groupB.map((team) => (
            <TeamCard key={team.name} team={team} onClick={() => setSelectedTeam(team)} />
          ))}
        </div>
      </div>

      {/* Team Dialog */}
      {selectedTeam && (
        <TeamDialog team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      )}
    </div>
  )
}

function TeamCard({team, onClick}: {team: Team; onClick: () => void}) {
  return (
    <button
      onClick={onClick}
      className="swatch-card bg-paper dark:bg-dark-card border border-slate-hairline dark:border-dark-border rounded-2xl p-6 text-center cursor-pointer
                 transition-all duration-200 hover:border-sage dark:hover:border-dark-primary focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
    >
      <div className={`logo-placeholder w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${team.color} text-white text-base`}>
        {team.shortName}
      </div>
      <h3 className="font-bold text-sm text-slate-ink dark:text-dark-text">{team.name}</h3>
      <span className="text-xs text-slate-stone dark:text-dark-text-secondary font-mono mt-1 block">
        Gruppe {team.group}
      </span>
    </button>
  )
}

function TeamDialog({team, onClose}: {team: Team; onClose: () => void}) {
  return (
    <dialog
      open
      className="max-w-md w-full"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`logo-placeholder w-14 h-14 bg-gradient-to-br ${team.color} text-white text-sm`}>
              {team.shortName}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-ink dark:text-dark-text">{team.name}</h3>
              <span className="text-xs text-slate-stone dark:text-dark-text-secondary font-mono">
                Gruppe {team.group}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-stone hover:text-slate-ink dark:hover:text-dark-text transition-colors"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm text-slate-stone dark:text-dark-text-secondary">
          <div className="flex justify-between py-2 border-b border-slate-hairline dark:border-dark-border">
            <span>Feld</span>
            <span className="font-mono text-slate-ink dark:text-dark-text">Platz {team.group}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-hairline dark:border-dark-border">
            <span>Spielzeit</span>
            <span className="font-mono text-slate-ink dark:text-dark-text">1 × 10 Min.</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-hairline dark:border-dark-border">
            <span>Modus</span>
            <span className="font-mono text-slate-ink dark:text-dark-text">3 vs 3</span>
          </div>
        </div>
      </div>
    </dialog>
  )
}
