import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Locale-Redirect — Client setzte ?locale=cs, wir setzen das Cookie
  // und leiten ohne Query-Param um. Nächster Server-Request hat
  // sofort die richtige Locale (kein Flash).
  const localeParam = request.nextUrl.searchParams.get("locale");
  if (localeParam === "de" || localeParam === "cs") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.delete("locale");
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("NEXT_LOCALE", localeParam, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Supabase cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getSession();

  return response;
}

// Only match internal paths (no API, no static files)
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
