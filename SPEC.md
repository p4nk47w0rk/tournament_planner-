# MVP-Spezifikation: Tournament Planner — Bambiny Cup Vilémov

> **Status:** Bereit für Agent-Implementierung
> **Ziel:** Ein live-fähiges Web-App für das Bambiny Cup 2026 Turnier in Vilémov, die als Referenz-Turnier für die spätere Multi-Turnier-Plattform dient.

---

## Problem Statement

Der Turnierorganisator (festes Admin-Konto) hat aktuell keine zentrale digitale Plattform, um Spielpläne, Live-Ergebnisse und Tabellen für das Bambini Cup 2026 zu verwalten. Zuschauer (Gäste) müssen vor Ort sein, um Ergebnisse zu sehen. Es gibt keinen Live-Feed, keine automatische Tabellenberechnung und keine Echtzeit-Updates.

## Solution

Eine Next.js Web-App mit Supabase-Backend, die folgende Kernfunktionen bietet:
- **Admin** kann Scores und Tore eingeben (mit optionalen Zeitstempeln und Spielernamen)
- **Gäste** sehen Spielplan, Live-Tabelle und Tore-Feed in Echtzeit (Supabase Realtime)
- **Statisches Referenz-Turnier** (Bambiny Cup) ist im Code verankert als "konfiguriert"
- **i18n** (Deutsch/Čeština) mit localStorage-Switch
- **Dark/Light Mode**
- **Mobile-first** responsive Design

---

## User Stories

### Authentifizierung & Rollen

1. Als **Turnierorganisator (Admin)**, möchte ich mich mit Email + Aktivierungslink + Password anmelden, damit ich Ergebnisse verwalten kann.
2. Als **Turnierorganisator**, möchte ich einen einmaligen Setup-Flow haben, bei dem ich nur meine Email eingebe und dann über einen Link ein Password setze, damit ich keinen manuellen Datenbank-Zugriff brauche.
3. Als **Gast (unangemeldet)**, möchte ich alle Turnierinfos, Spielpläne und Tabellen sehen können, ohne mich anzumelden.
4. Als **Admin**, bin ich die **einzige** Person mit Schreibrechten — keine Selbstregistrierung möglich.
5. Als **Admin**, möchte ich zwischen Edit-Modus und Lese-Modus wechseln können, damit ich nicht ständig aus- und einloggen muss.

### Gruppenphase & Spielplan

6. Als **Admin**, möchte ich alle 20 Gruppenspiele (10 je Gruppe A+B) sehen, mit Zeit, Spielfeld und aktuellem Score, damit ich den Überblick behalte.
7. Als **Admin**, möchte ich für jedes Spiel `[+]` Tor [Heim] und `[−]` Tor [Gast] klicken können, damit ich schnell Scores erfassen kann.
8. Als **Admin**, möchte ich optional einen **Zeitstempel** pro Tor eingeben können (z.B. "12'"), damit der Feed realistisch aussieht.
9. Als **Admin**, möchte ich optional einen **Spielernamen** pro Tor eingeben können (z.B. "M. Fukal"), damit Tore detailliert nachverfolgbar sind.
10. Als **Gast**, möchte ich den Spielplan in chronologischer Reihenfolge sehen, damit ich die nächste Partie erkenne.
11. Als **Gast**, möchte ich für jedes Spiel den aktuellen Score **und** einen chronologischen Tore-Feed sehen (z.B. `⚽ 12' Vilémov (M. Fukal)`), ähnlich wie bei einer Bundesliga-Übersicht.
12. Als **Gast**, soll Tore-Feed auch ohne Zeitstempel und Spielernamen funktionieren — dann zeigt er nur `⚽ Vilémov`.

### Live-Tabelle (Gruppenstand)

13. Als **Gast**, möchte ich die Tabelle jeder Gruppe in Echtzeit sehen (Platz, Team, Spiele, Siege, Unentschieden, Niederlagen, Tore, TD, Punkte).
14. Als **Gast**, soll sich die Tabelle **automatisch** berechnen wenn ein Score geändert wird, ohne dass ich die Seite neu laden muss.
15. Als **Admin**, möchte ich manuell Scores für einzelne Spiele eingeben/ändern können, nicht nur Tore.

### Playoffs

16. Als **Gast**, möchte ich die komplette Playoff-Brackettstruktur sehen: Play-in → Viertelfinale → Halbfinale → Finale + Platz 3.
17. Als **Admin**, möchte ich Playoff-Spiele manuell anlegen und verwalten können.
18. Als **Gast**, soll der Playoff-Sieger (vítěz) markiert werden, wenn das Finale beendet ist.
19. Als **Admin**, soll Playoff-Spiele genauso wie Gruppenspiele verwaltet werden können (Score, Tore-Feed).

### Realtime-Updates

20. Als **Gast**, sollen sich **sofort** alle Änderungen spiegeln, wenn der Admin einen Score oder Tor einträgt (keine Seite-Neu-Laden).
21. Als **Gast**, soll der Tore-Feed live aktualisiert werden — neue Tore erscheinen sofort unten im Feed.

### UI & UX

22. Als **Gast** auf einem Mobilgerät, möchte ich die gesamte App bedienerfreundlich nutzen können (Touch-Targets ≥ 44px, responsive Layout).
23. Als **Gast**, möchte ich zwischen Deutsch und Čeština umschalten können, damit er/sie die App in der bevorzugten Sprache liest.
24. Als **Nacht-Besucher**, möchte ich den Dark Mode aktivieren können, damit die Augen nicht geblendet werden.
25. Als **Gast** auf der Startseite, soll ein Countdown-Timer bis zum Turnierstart angezeigt werden.
26. Als **Gast**, möchte ich Infos zum Turnier, Verpflegung und Ort sehen können.
27. Als **Gast**, möchte ich alle 10 Mannschaften mit ihren Gruppenzugehörigkeiten sehen.

### Architektur & Wartbarkeit

28. Als **Entwickler**, soll die Tournament-Config (Teams, Spiele, Playoffs) in einer zentralen Datei (`tournament-data.ts`) bleiben, damit sie leicht durch ein DB-Backend ersetzt werden kann.
29. Als **Entwickler**, soll die Rolle (admin, guest) später aufspaltbar sein, ohne die bestehende UI brechen zu müssen (Rollen-Interface vorbereiten).

---

## Implementation Decisions

### Architektur: Static Config → DB Migration Path

Das Referenz-Turnier (Bambiny Cup Vilémov) wird **statisch** in `src/lib/tournament-data.ts` definiert. Die Architektur folgt dem Prinzip "statisch first, DB later" — das Datenmodell wird so entworfen, dass später einfach eine andere Datenquelle (Supabase/PostgreSQL) injectet werden kann, ohne die UI zu ändern.

**Module-Grenzen:**

| Modul | Verantwortung | API/Schnittstelle |
|---|---|---|
| `TournamentConfig` | Statische Definitionen: Teams, Gruppen, Spiele, Playoffs | `export const TEAMS`, `MATCHES`, `PLAYOFFS` |
| `MatchService` | CRUD für Spiele, Score-Updates, Tore | `getMatches()`, `updateScore()`, `addGoal()` |
| `StandingsService` | Berechnet Tabelle aus Spiele-Ergebnissen | `calculateStandings()` |
| `AuthService` | Admin-Login, Session, Aktivierungslink-Flow | `sendActivationEmail()`, `verifyPassword()`, `getSession()` |
| `RealtimeService` | Supabase Realtime Subscriptions | `subscribeToMatches()`, `subscribeToGoals()` |
| `GoalService` | Tor-Erfassung (mit optionalen Feldern) | `addGoal(matchId, team, time?, player?)` |

### Datenbank-Erweiterungen (Supabase)

**Neue Tabelle: `goals`** (Tore-Feed)

```
id: BIGSERIAL PK
match_id: BIGINT FK → matches(id)
team: TEXT (home_team oder away_team des Spiels)
minute: TEXT NULL (optional, z.B. "12'")
player: TEXT NULL (optional, z.B. "M. Fukal")
created_at: TIMESTAMPTZ
```

**Aktuelle Tabelle: `matches`** bleibt unverändert (Score, Status).
**Keine neuen Tabellen** für Playoffs — Playoffs werden in `matches` mit `phase='play_in' | 'quarterfinal' | 'semifinal' | 'final' | 'bronze'` und `status='scheduled'` repräsentiert.

### Auth-Flow: Aktivierungslink

```
Admin (Email) → POST /api/auth/request-activation → 
  Supabase sendet Magic Link / Activation Link →
  User klickt Link → Setzt Password → 
  Session wird erstellt → Login成功
```

Das erfordert:
- Supabase Email Templates angepasst (Activation Flow)
- API Route `/api/auth/request-activation` (sendet Email)
- Login-Page mit "Email eingeben → Password setzen" Flow

### Realtime-Strategie

- `matches` table: ROW changes via `channel.on('postgres_changes', ...)` 
- `goals` table: INSERT changes via Supabase Realtime
- UI rendert sich selbst — kein Push von berechneten Werten
- Tabelle wird bei jedem Score-Change aus den aktuellen Match-Daten **neu berechnet** (Client-Side Berechnung + Server-Side Validierung)

### UI-Layout: Bundesliga-Style Match Card

Jede Match-Card zeigt:
```
┌──────────────────────────────────────────────┐
│  12:00  │  Varnsdorf         2  -  1    Vilémov   │
│         │  Platz A              Gruppe A       │
│         │──────────────────────────────────────│
│         │  ⚽ 12' Vilémov (M. Fukal)            │
│         │  ⚽ 34' Varnsdorf                      │
│         │  ⚽ 56' Varnsdorf (J. Novák)           │
└──────────────────────────────────────────────┘
```

- **Admin-Modus:** Score-Zeile wird zu Input-Feldern + `[+]`/`[-]` Buttons + optional Time/Name Inputs
- **Gast-Modus:** Score + Feed als Text, Tore-Feed scroll-able bei vielen Toren

### Tabellen-Layout

Klassische Ligatabelle mit den Spalten:
```
# | Team | Spiele | S | U | N | Tore | TD | Punkte
```

Sortiert nach: Punkte (desc) → Tordifferenz (desc) → Tore (desc).

### i18n Architektur

- `src/lib/translations/messages/de.json` + `cs.json`
- `next-intl` mit `useTranslations()` Hook
- Locale wird über `LocaleProvider` (localStorage) gesteuert
- **Fix:** Aktuelle Implementierung lädt locale nicht korrekt in Server Components — muss über middleware + cookie gelöst werden

### Dark Mode

- next-themes mit `ThemeProvider`
- CSS custom properties für Design Tokens (bereits vorhanden in `globals.css`)

### Mobile-First Breakpoints

- Base: `max-width: 100%` für Mobile
- `sm:` 640px (kleine Tablets)
- `md:` 768px (Tablets)
- `lg:` 1024px (Desktop)
- Touch-Targets: alle interaktiven Elemente ≥ 44px (Tailwind `min-h-[44px] min-w-[44px]`)

### CI Design Tokens (unverändert)

```css
--bg: #F7F6F2
--bg-dark: #1A1F2B
--text: #3B5E4D
--text-dark: #E0E0E0
--accent: #D97757
--gold: #E2B86B
```

### Rolle-Interface für spätere Aufspaltung

```typescript
type Role = 'admin' | 'guest'  // später: 'organizer' | 'team-manager' | 'scorekeeper'

interface Permission {
  canEditScores: boolean
  canEditGoals: boolean
  canEditPlayoffs: boolean
  canViewAll: boolean
  canEditTournament: boolean
}
```

MVP: Nur `admin` (alle true) und `guest` (alle false außer `canViewAll`).

---

## Testing Decisions

### Unit Tests
- `StandingsService.calculateStandings()` — Input: Match-Array → Output: Sortierte Tabelle. Test mit verschiedenen Konfigurationen (Unentschieden, gleiche Punkte, TD-Entscheidung).
- `MatchService.updateScore()` — Input: matchId, homeScore, awayScore → Output: Updated match + status-Change wenn 0:0 nach 0:0.

### Integration Tests (wenn Test-Framework gewählt)
- Auth-Flow: request-activation → email → password-set → login-success
- Realtime: Admin submits goal → guest receives update via Supabase subscription

### E2E Tests (optional, V2)
- Admin login → set score → verify table updates → logout
- Guest view → check all pages load → switch language → switch dark mode

### Manuelle Tests
- Mobile-Browser: Touch-Targets, Scroll-Verhalten, Feed-Darstellung
- Cross-browser: Safari, Chrome, Firefox (iOS + Desktop)
- Realtime: Zwei Browser-Tabs offen → Score im einen ändern → anderen Tab beobachten

---

## Out of Scope (MVP)

- **Turnier erstellen** — Nur Bambiny Cup Vilémov existiert
- **Spielzeit/Stoppuhr** — Tore haben optionale Zeitstempel, aber keine Spielfortschritts-Anzeige
- **Spieler-Tore-Statistiken** — Nur Spielername optional, keine Statistiken pro Spieler
- **Rollenverteilung** — Nur admin + guest, keine Team-Manager oder Spielschreiber
- **Andere Sportarten** — Nur Fußball
- **Mehrere Turniere** — Nur ein Turnier im MVP
- **Push-Benachrichtigungen** — Nur browser-refresh via Realtime
- **Team-Logos hochladen** — Platzhalter-Farben reichen für MVP
- **PDF Export** — Kein Export im MVP
- **Social Sharing** — Shareable URL ist implizit (URL ist der Link)

---

## Further Notes

### MVP Priority Order

1. **Auth-Flow** — Admin muss sich anmelden können
2. **Spielplan + Score-Eingabe** — Kernfeature
3. **Tore-Feed** — Bundesliga-Style Anzeige
4. **Tabelle (live)** — Automatische Berechnung
5. **Realtime** — Supabase Subscriptions
6. **Playoffs** — Manuell anlegbar, statische Struktur
7. **i18n DE/CS fixen** — Sprachwechsel reparieren
8. **Dark Mode** — Existiert, prüfen ob funktioniert
9. **Countdown** — Existiert, prüfen
10. **Responsive/Mobile** — Testen und evtl. anpassen

### Known Issues im bestehenden Code

- **i18n Language Switch:** `window.location.reload()` in `LocaleProvider` ist suboptimal — besser über cookie + next-intl middleware
- **Supabase Hooks:** Bestehen noch, müssen geprüft werden ob sie korrekt mit der neuen DB-Schema-Version (`goals` Tabelle) arbeiten
- **Playoff-Data:** Noch nicht im `tournament-data.ts` enthalten — muss hinzugefügt werden (Play-in, QF, SF, Finale, Platz 3)

### Data Model: Goal Interface

```typescript
interface Goal {
  id: number
  matchId: number
  team: string  // "Varnsdorf" (muss existierender Team-Name sein)
  minute: string | null  // "12'" oder null
  player: string | null  // "M. Fukal" oder null
  createdAt: string
}
```

### Supabase Realtime Setup

- `goals` Tabelle muss `ENABLE ROW LEVEL SECURITY` und Realtime erhalten
- Policy: `Anyone can read goals`, `Authenticated users can insert goals`
- Supabase Channel subscription in `MatchCard` Component für Live-Feed
