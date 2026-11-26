# Development Journal — Tournament Planner

> Entscheidungen, Begründungen und Meilensteine des gesamten Projekts.

## [2026-11-25] Projektstart

### Decision: SaaS-Produkt mit Web-First-Ansatz
**Kontext:** User wollte "Tournament Planner" als allgemeines Produkt, nicht nur Bambini Cup.
**Entscheidung:** 
- Web-App zuerst (Next.js 16 + React 19), iOS Native später
- SaaS-Architektur im Hinterkopf, aber MVP ist ein Single-Tournament
- Bambini Cup Vilémov dient als Referenz-Turnier (statisch eingebaut als "Konfigurations-Status-quo")

### Decision: Fester Admin, keine Selbstregistrierung
**Kontext:** User möchte, dass nur ein fester Admin das Turnier konfigurieren kann.
**Entscheidung:**
- MVP: Nur eine Admin-Rolle (macht Organisator + Team-Manager + Spielschreiber + Admin)
- Authentifizierung via Supabase Email/Password
- Kein Public-Registration — Admin wird manuell angelegt
- Gast-Rolle (nur lesen) ist der Standard-Unlogged-Zustand

### Decision: Rollenarchitektur später aufteilen
**Kontext:** User hat klare Vorstellung für spätere Rollen.
**Entscheidung (MVP):**
- `admin` — Kann ALLES (Turnier konfigurieren, Teams, Spielplan, Scores)
- `guest` — Kann ALLES SEHEN (Spielplan, Tabelle, Infos), kann NICHTS bearbeiten
- **Zukünftig aufzuspalten:** Organisator, Team-Manager, Spielschreiber
- Role hierarchy im Code vorbereiten, aber MVP reduziert auf admin + guest

### Decision: Systematisch konfigurierbar (Architektur-Vorentscheid)
**Kontext:** User will später alle Configs dynamisch machen.
**Entscheidung:**
- MVP: Turniere statisch in `tournament-data.ts` eingebaut
- Architektur so aufbauen, dass Config später von DB/Backend kommt
- Datenmodell für Turnier-Config vorbereiten (Format, Rules, etc.)

---

## [2026-11-26] Design Phase — Grilling

### Decision: MVP Scope = Bambini Cup Vilémov
**Kontext:** Welche Features müssen im MVP sein?
**Entscheidung:** Alle Features die das Bambini Cup-2026-Turnier unterstützen:
- Gruppe A + B (5 Teams je), 20 Gruppenphase-Spiele
- Live-Tabelle berechnet sich automatisch
- Playoffs (Play-in + Viertelfinale + Halbfinale + Finale + Platz 3)
- Spielplan mit Zeit, Spielfeld, Status
- Score-Eingabe nur für Admin
- Fairplay-System
- Countdown-Timer
- i18n (DE/CS)
- Dark Mode
- Realtime-Updates (mehrere Viewer sehen gleiche Tabelle)
- Shareable URL für das Turnier

## [2026-11-26] Design Phase — Grilling Runde 2

### Decision: Live-Feed Tore statt nur Score
**Kontext:** User will Bundesliga-ähnliche Tore-Übersicht.
**Entscheidung:**
- Tore-Feed unter jedem Spiel: chronologisch mit Zeitstempel (optional) und Spielername (optional)
- Admin kann Tore erfassen mit `[+]` Tor [Heim] / `[−]` Tor [Gast]
- Optional: Zeit eingeben (wenn nicht → leer)
- Optional: Spielername eingeben (wenn nicht → leer)
- Gäste sehen den Feed live (Realtime via Supabase)

### Decision: MVP Feature-Liste finalisiert
**Alle Features die das Bambini Cup unterstützen müssen:**
- Fester Admin (Email → Aktivierungslink → Password) + Gast-Rolle
- Gruppenphase: 2 Gruppen × 5 Teams, 20 Spiele statisch
- Automatische Tabelle (Punkte, Tore, Differenz)
- Score-Eingabe + Tore-Feed (Admin nur, realtime)
- Playoffs: Play-in → QF → SF → Finale + Platz 3 (statisch)
- Dark/Light Mode
- Sprachwechsel DE/CS (reparieren)
- Countdown-Timer
- Mobile-first responsive
- Nur 1 Turnier im MVP (Bambiny Cup Vilémov)

---

## [2026-11-26] MVP Spezifikation erstellt

### Decision: Specs-Release
**Kontext:** Alle Design-Entscheidungen wurden gesammelt.
**Entscheidung:**
- Spec geschrieben in `SPEC.md` — 29 User Stories
- 6 Module definiert: TournamentConfig, MatchService, StandingsService, AuthService, RealtimeService, GoalService
- Neue DB-Tabelle: `goals` (mit optional minute + player)
- Auth-Flow: Email → Aktivierungslink → Password setzen
- Priority Order: Auth → Spielplan/Score → Tore-Feed → Tabelle → Realtime → Playoffs → i18n → Dark Mode → Countdown → Mobile

### Decision: Playoff-Struktur (aus HTML-Dateien extrahiert)
**Kontext:** Playoff-Bracket in `info/turnier/bambiny-cup-2026-playoff.html`
**Entscheidung:**
- Play-in: 3. A vs 4. A, 3. B vs 4. B (2 Spiele)
- Viertelfinale: 1A vs Playin-Winner-2, 2B vs Playin-Winner-1, 1B vs Playin-Winner-1, 2A vs Playin-Winner-2 (4 Spiele)
- Halbfinale: 2 Spiele
- Finale + Platz 3: 2 Spiele
- Sieger wird als `vítěz` markiert
- Statisch im MVP (keine automatische Generierung)

### Decision: Tore-Eintrag UI
**Kontext:** Bundesliga-ähnliche Übersicht gewünscht
**Entscheidung:**
- Score-Zeile mit Tore-Feed darunter
- Beispiel: `Varnsdorf  2 - 1  Vilémov`
- Feed: `⚽ 12' Vilémov (M. Fukal)` oder `⚽ Varnsdorf` ohne Zeit/Name
- Admin Eingabe: `[+] Heim` / `[− Gast]` mit optionalen Feldern für Zeit und Name

---
