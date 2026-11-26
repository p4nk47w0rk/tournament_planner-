'use client'

import {useLocale} from '@/lib/locale-context'
import {useTranslations} from 'next-intl'

export default function LocaleSwitcher() {
  const {locale, setLocale} = useLocale()
  const t = useTranslations('nav')

  const nextLocale = locale === 'de' ? 'cs' : 'de'

  const handleSwitch = () => {
    setLocale(nextLocale)
    // Set cookie for server components (next-intl reads from NEXT_LOCALE cookie)
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`
  }

  return (
    <button
      onClick={handleSwitch}
      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                 bg-slate-100 dark:bg-dark-secondary text-slate-600 dark:text-dark-text-secondary
                 hover:bg-slate-200 dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-[#3B5E4D]"
      aria-label="Sprache wechseln"
    >
      {locale === 'de' ? '🇩🇪 DE' : '🇨🇿 CS'}
    </button>
  )
}
