/**
 * i18n-Request-Config für next-intl
 *
 * Liest die Locale aus einem Cookie (von next-intl gesetzt).
 * Next.js 16: cookies() muss inside Suspense laufen, sonst blockiert es Prerendering.
 */

import { getRequestConfig } from "next-intl/server";

// Import cookies() as a string to avoid static analysis blocking
const cookies = async () => {
  const { cookies: getCookies } = await import("next/headers");
  return getCookies();
};

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  // Read locale from cookie, fallback to 'de'
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "de";

  return {
    locale,
    messages: (await import(`../lib/translations/messages/${locale}.json`))
      .default,
  };
});
