# T02: Admin-Auth-Flow

**Was zu bauen ist:** Der Admin (Turnierorganisator) kann sich über einen Email-basierten Aktivierungs-Flow registrieren und dann einloggen. Gäste müssen sich nicht anmelden.

**Blocked by:** T01 (Setup & DB-Schema)

**Status:** ready-for-agent

- [ ] API Route `/api/auth/request-activation`: Nimmt Email, sendet Supabase Magic Link / Password-Setup-Email
- [ ] Supabase Email Template anpassen (custom activation flow)
- [ ] Login-Seite erweitern: "Email eingeben → Link erhalten → Password setzen → Einloggen"
- [ ] `src/lib/supabase/server.ts`: Funktion `getRole()` hinzufügen (admin vs guest)
- [ ] Navbar: Login-Button für Gäste, Admin-Logout für Admins
- [ ] `src/lib/locale-context.tsx`: Locale-Problem fixen (nicht mehr `window.location.reload()`, sondern cookie-basiert mit next-intl middleware)
- [ ] Auth-State wird global verfügbar (Provider im `layout.tsx`)
