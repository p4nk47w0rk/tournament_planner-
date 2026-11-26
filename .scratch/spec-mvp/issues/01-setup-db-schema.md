# T01: Setup & DB-Schema für MVP

**Was zu bauen ist:** Die Datenbank ist bereit für Tore-Feeds und Realtime-Updates. Das Supabase-Projekt wird initialisiert.

**Blocked by:** None (kann sofort starten)

**Status:** ready-for-agent

- [ ] `goals` Tabelle in `supabase/init.sql` hinzufügen:
  - `id BIGSERIAL PK`
  - `match_id BIGINT FK → matches(id) ON DELETE CASCADE`
  - `team TEXT` (Team-Name, z.B. "Varnsdorf")
  - `minute TEXT NULL` (optional, z.B. "12'")
  - `player TEXT NULL` (optional, z.B. "M. Fukal")
  - `created_at TIMESTAMPTZ DEFAULT NOW()`
- [ ] RLS-Policies für `goals`: Anyone read, Authenticated write
- [ ] Realtime für `goals` aktivieren
- [ ] Index auf `match_id` für schnelle Query
- [ ] Supabase Local Docker starten und Schema anwenden
- [ ] `.env.local` Vorlage erstellen mit SUPABASE_URL und SUPABASE_ANON_KEY
