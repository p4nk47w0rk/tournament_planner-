'use client'

import {useTranslations} from 'next-intl'

export default function InfoPage() {
  const t = useTranslations('info')

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text mb-8">
        {t('title')}
      </h1>

      {/* Regeln */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
          ⚽ {t('rules')}
        </h2>
        <div className="bg-paper dark:bg-dark-card border border-slate-hairline dark:border-dark-border rounded-2xl p-6">
          <ul className="space-y-3">
            {t.raw('rulesItems').map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-stone dark:text-dark-text-secondary">
                <span className="w-6 h-6 rounded-full bg-sage-mist dark:bg-dark-secondary flex items-center justify-center text-xs text-sage-dark dark:text-dark-primary shrink-0 mt-0.5 font-mono">
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
        <h2 className="text-xl font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
          🍕 {t('canteen')}
        </h2>
        <div className="bg-paper dark:bg-dark-card border border-slate-hairline dark:border-dark-border rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {t.raw('canteenItems').map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-stone dark:text-dark-text-secondary">
                <span className="w-2 h-2 rounded-full bg-terracotta shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standort */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
          📍 {t('location')}
        </h2>
        <div className="bg-paper dark:bg-dark-card border border-slate-hairline dark:border-dark-border rounded-2xl p-6">
          <p className="text-sm text-slate-stone dark:text-dark-text-secondary mb-4">
            Sporthalle Vilémov · Indoor-Halle
          </p>
          <a
            href="https://maps.google.com/?q=Vilémov+Sporthalle"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            🗺️ In Google Maps öffnen
          </a>
        </div>
      </section>

      {/* Veranstalter */}
      <section>
        <h2 className="text-xl font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
          🏆 {t('organizers')}
        </h2>
        <div className="bg-paper dark:bg-dark-card border border-slate-hairline dark:border-dark-border rounded-2xl p-6">
          <div className="space-y-3 text-sm text-slate-stone dark:text-dark-text-secondary">
            <div className="flex justify-between py-2 border-b border-slate-hairline dark:border-dark-border">
              <span>Veranstalter</span>
              <span className="font-medium text-slate-ink dark:text-dark-text">SV Fortschritt Großharthau</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-hairline dark:border-dark-border">
              <span>Turniersteuerung</span>
              <span className="font-medium text-slate-ink dark:text-dark-text">L. Sklenář</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Website</span>
              <a href="https://svfg.de" target="_blank" rel="noopener noreferrer" className="font-medium text-sage dark:text-dark-primary hover:underline">
                svfg.de
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
