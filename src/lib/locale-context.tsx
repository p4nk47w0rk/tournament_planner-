'use client'

import {createContext, useContext, useState, useCallback, useEffect} from 'react'
import {useTranslations} from 'next-intl'

export type Locale = 'de' | 'cs'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'de',
  setLocale: () => {},
})

export function LocaleProvider({children}: {children: React.ReactNode}) {
  const [locale, setLocaleState] = useState<Locale>('de')

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale
    if (stored === 'de' || stored === 'cs') {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    // No reload needed — client-side re-renders with new locale
    // Server components pick up locale from NEXT_LOCALE cookie via middleware
  }, [])

  return (
    <LocaleContext.Provider value={{locale, setLocale}}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
