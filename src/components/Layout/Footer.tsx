import {useTranslations} from 'next-intl'

export default function Footer() {
  const t = useTranslations('info')

  return (
    <footer className="border-t border-slate-hairline dark:border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-stone dark:text-dark-text-secondary">
            © 2026 SV Fortschritt Großharthau · Tournament Planner
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-stone dark:text-dark-text-secondary">
            <a href="https://svfg.de" target="_blank" rel="noopener noreferrer" className="hover:text-sage dark:hover:text-dark-primary transition-colors">
              svfg.de
            </a>
            <span>Impressum</span>
            <span>Datenschutz</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
