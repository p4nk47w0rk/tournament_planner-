'use client'

import {useTranslations} from 'next-intl'
import Hero from '@/components/Hero/HomeHero'
import MatchCard from '@/components/Spielplan/MatchCard'
import {
  INITIAL_MATCHES,
  type Match,
  TEAMS,
} from '@/lib/tournament-data'
import Link from 'next/link'
import {Suspense} from 'react'

export default function HomePage() {
  const t = useTranslations('home')
  const scheduleT = useTranslations('schedule')

  return (
    <div>
      {/* Hero Section */}
      <Hero matches={INITIAL_MATCHES} />

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          <QuickLink
            href="/spielplan"
            title={scheduleT('title')}
            description="Alle Spiele auf einen Blick"
            icon="⚽"
          />
          <QuickLink
            href="/gruppen"
            title="Gruppenstände"
            description="Punkte, Tore, Platzierungen"
            icon="📊"
          />
          <QuickLink
            href="/teams"
            title="Mannschaften"
            description="Alle 10 Teams im Detail"
            icon="🏆"
          />
        </div>

        {/* Next matches preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Suspense fallback={<div className="text-slate-stone dark:text-dark-text-secondary">Laden...</div>}>
            <NextMatchSection />
          </Suspense>
          <GroupPreview />
        </div>
      </section>
    </div>
  )
}

function QuickLink({href, title, description, icon}: {
  href: string
  title: string
  description: string
  icon: string
}) {
  return (
    <Link
      href={href}
      className="swatch-card bg-paper dark:bg-dark-card border border-slate-hairline dark:border-dark-border rounded-2xl p-6
                 flex items-center gap-4 group cursor-pointer hover:border-sage dark:hover:border-dark-primary
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
    >
      <span className="text-3xl">{icon}</span>
      <div className="text-left">
        <h3 className="font-bold text-slate-ink dark:text-dark-text group-hover:text-sage dark:group-hover:text-dark-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-stone dark:text-dark-text-secondary mt-0.5">{description}</p>
      </div>
    </Link>
  )
}

function NextMatchSection() {
  const t = useTranslations('home')
  const now = Date.now()
  const tournamentDate = new Date('2026-12-05T09:00:00').getTime()

  // Show first 3 games as next matches
  const upcomingMatches = INITIAL_MATCHES
    .filter((m) => m.homeScore === null && m.awayScore === null)
    .slice(0, 3)

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
        {t('nextMatch')}
      </h2>
      <div className="space-y-3">
        {upcomingMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  )
}

function GroupPreview() {
  const t = useTranslations('home')

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4">
        {t('stats.groups')}
      </h2>
      <div className="space-y-4">
        {(['A', 'B'] as const).map((group) => {
          const groupTeams = TEAMS.filter((t) => t.group === group)
          return (
            <div key={group} className="bg-paper dark:bg-dark-card border border-slate-hairline dark:border-dark-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-slate-ink dark:text-dark-text mb-2">
                Gruppe {group} · Feld {group}
              </h3>
              <div className="space-y-2">
                {groupTeams.map((team) => (
                  <div key={team.name} className="flex items-center gap-3">
                    <div className={`logo-placeholder w-8 h-8 rounded-lg bg-gradient-to-br ${team.color} text-white text-xs shrink-0`}>
                      {team.shortName}
                    </div>
                    <span className="text-sm text-slate-stone dark:text-dark-text-secondary">{team.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
