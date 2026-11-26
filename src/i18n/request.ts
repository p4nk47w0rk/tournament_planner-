// next-intl request config
import {getRequestConfig} from 'next-intl/server'
import {cookies} from 'next/headers'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  // Read locale from cookie, fallback to 'de'
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'de'

  return {
    locale,
    messages: (await import(`../lib/translations/messages/${locale}.json`)).default,
  }
})
