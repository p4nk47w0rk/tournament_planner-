# Deployment Guide

## Was du jetzt machen musst

### 1. GitHub Secrets setzen

Geh auf GitHub → Repository → **Settings → Secrets and variables → Actions** und füge hinzu:

| Secret Name           | Wert                                        | Woher                                                 |
| --------------------- | ------------------------------------------- | ----------------------------------------------------- |
| `SUPABASE_URL`        | `https://hcacssnayskproszwkdl.supabase.co`  | Supabase Dashboard → Connect                          |
| `SUPABASE_SECRET_KEY` | `sb_secret_Z9VDcT9wRLsqimRLHR6K2Q_36GidzNs` | Supabase Dashboard → Settings → API Keys → Secret key |

Das ist alles — danach kann ich Migrationen und Deployments automatisch auslösen.

### 2. Schema auf Live-Projekt anwenden

Die Datenbank-Tabellen müssen einmalig auf das Live-Projekt angewendet werden.

**Option A — Ich mache es jetzt (empfohlen):**
Sag mir einfach "wende Schema an" und ich führe die Migration gegen dein Live-Projekt aus.

**Option B — Du machst es manuell:**

- Supabase Dashboard → SQL Editor
- Inhalt von `supabase/init.sql` reinpasten → Execute
- Dann auch `supabase/migrations/004_site_settings.sql` → Execute

### 3. Vercel verbinden

- Auf [vercel.com](https://vercel.com) anmelden
- "Add New Project" → GitHub-Repo `tournament-planner` importieren
- Vercel erkennt automatisch Next.js
- Environment Variables in Vercel Settings eintragen:

| Variable                               | Wert                                             |
| -------------------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`             | `https://hcacssnayskproszwkdl.supabase.co`       |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_t_tmmro4MfL2fOtNEW65bQ_ZiCH9wjV` |
| `SUPABASE_URL`                         | `https://hcacssnayskproszwkdl.supabase.co`       |
| `SUPABASE_SECRET_KEY`                  | `sb_secret_Z9VDcT9wRLsqimRLHR6K2Q_36GidzNs`      |
| `LOCAL_DEV_EMAIL`                      | `test@example.com`                               |
| `LOCAL_DEV_PASSWORD`                   | `testpassword123`                                |

### 4. Fertig!

Jeder Push nach `main` löst jetzt aus:

1. **CI**: Lint → Typecheck → Test → Build
2. **Deploy**: Supabase Migrations → Vercel baut & deployt

---

## Automatisierte Migrations

Wenn ich später Tabellen hinzufüge (z.B. für neue Features), kann ich:

- Das Schema in `supabase/init.sql` updaten
- Push nach `main` → GitHub Actions → Migration wird automatisch angewendet
