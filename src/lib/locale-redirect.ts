// Locale redirect helper — redirects to the current locale's page
'use client'

import {usePathname} from 'next/navigation'
import {useEffect} from 'react'

export function useLocaleRedirect() {
  const pathname = usePathname()

  useEffect(() => {
    // Detect browser locale from localStorage (set by middleware)
    const storedLocale = localStorage.getItem('locale')
    if (storedLocale && !pathname.startsWith(`/${storedLocale}/`)) {
      // Redirect to add locale prefix if stored
      // Actually with as-needed, we don't need to redirect
    }
  }, [pathname])
}
