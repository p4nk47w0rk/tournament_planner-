# 🏟️ Bambini CUP 2026 – Projektplan Web-App

## 📋 Zusammenfassung der Turnier-Infos

| Feld | Wert |
|---|---|
| **Name** | Bambiny CUP 2026 |
| **Datum** | **Samstag, 5. Dezember 2026** |
| **Start** | 09:00 Uhr |
| **Ort** | **Sporthalle Vilémov** (indoor) |
| **Modus** | 3-gegen-3, 1 × 10 Minuten |
| **Schiedsrichter** | Leiter oder Trainer der Mannschaften |
| **Gruppen** | A (5 Teams) + B (5 Teams) |
| **Gruppenphase** | 20 Spiele (10 pro Gruppe) |
| **Pause** | Bis 12:00 Uhr |
| **Playoffs** | Ab 12:00 Uhr |
| **Auszeichnung** | Medaillen & Diplome für Platz 1–3 |
| **Verpflegung** | Langos, Würstchen, Pommes, Süßwaren, Limonaden |
| **Spielfelder** | 2 Hallenbereiche (Platz A + Platz B) |

### Mannschaften (10 Teams)

**Gruppe A (Platz A):**
1. Varnsdorf
2. Šluknov B
3. Česká Lípa A
4. Grossharthau
5. Vilémov (Heimmannschaft)

**Gruppe B (Platz B):**
1. SFA Jiřetín
2. Neusalza
3. Šluknov A
4. Česká Lípa B
5. Union Děčín

---

## ✅ ALLE FRAGEN BEANTWORTET

### 1. Playoff-Struktur (aus playoff.html)

Das Original-Bracket ist für **12 Teams (3 Gruppen × Platz 1–4)** ausgelegt. Wir haben nur 10 Teams (2 Gruppen). Daher:

**Playoff-Format (angepasst für 2 Gruppen):**
```
Platzierungen der Gruppenphase → Playoffs:

Gruppenphase-Rangliste pro Gruppe:
  Platz 1 → Viertelfinale (byé)
  Platz 2 → Viertelfinale (byé)
  Platz 3 → Play-in Round (gegen anderer Gruppe Platz 3)
  Platz 4 → Play-in Round (gegen anderer Gruppe Platz 4)

Round of 16 (Play-in):
  PO1: 4.A vs 4.B → Gewinner → QF
  PO2: 3.A vs 3.B → Gewinner → QF

Quarterfinals:
  QF1: 1.A vs Winner(PO1)
  QF2: 2.A vs Winner(PO2)
  QF3: 1.B vs Winner(PO1)  [Platzhalter]
  QF4: 2.B vs Winner(PO2)  [Platzhalter]

Semifinals:
  SF1: Winner(QF1) vs Winner(QF2)
  SF2: Winner(QF3) vs Winner(QF4)

Finals:
  FINAL: Winner(SF1) vs Winner(SF2) → 1. Platz
  3rd Place: Loser(SF1) vs Loser(SF2) → 3./4. Platz
```

**Umsetzung:** Wir bauen erstmal **Platzhalter** für die Playoffs. Die echte Logik kommt später dazu.

### 2. Datum & Ort ✅
- **Samstag, 5. Dezember 2026** in **Vilémov**
- Indoor in der Sporthalle

### 3. Team-Logos 🔍

Ich habe im Web gesucht! Hier sind die Ergebnisse:

| Team | Logo verfügbar? | Quelle |
|---|---|---|
| **SV Fortschritt Großharthau** | ✅ Ja (CI + Web) | `svfg.de` |
| **Vilémov (SK Stap-Tratec)** | ✅ Ja | `skvilemov.cz`, Wikipedia, IconApe |
| **FK Varnsdorf** | ✅ Ja | `fkvarnsdorf.cz`, Wikipedia, Global Sports Archive |
| **SK Šluknov** | ✅ Ja | `sksluknov.cz` |
| **FK Arsenal Česká Lípa** | ✅ Ja (SVG auf Wikipedia) | `fkceskalipa.cz`, `football-logos.cc`, Wikipedia |
| **TJ Lokomotiva Česká Lípa** | ✅ Ja | `loko-cl.cz`, Wikipedia |
| **FC Nový Bor** | ✅ Ja (grün/weiß) | `fcnovybor.cz`, Wikipedia, IconApe |
| **Union Děčín** | ⚠️ Keine direkten Logos | Nur in Tabellen erwähnt |
| **SFA Jiřetín** | ⚠️ Keine direkten Logos | Gemeinde-Seite `jiretin.cz` |
| **Neusalza** | ⚠️ Keine direkten Logos | |

**Für Teams ohne Logos:** Wir erstellen einfache Platzhalter-Karten mit Team-Farben und Initialen (z.B. "UD" für Union Děčín) oder nutzen die Vereinswappen aus dem CI-System.

### 4. Fairplay-Modus ⚽

**Was ist Fairplay im Bambini-Fußball?**
Bei Bambini-Turnieren (U7) gibt es keine echten Schiedsrichter – die Trainer oder Betreuer der Mannschaften pfeifen selbst. Daher ist Fairplay das zentrale Prinzip:

- **Ehrliche Ergebnismeldung**: Jeder Trainer trägt selbst das Ergebnis ein
- **Fairplay-Punkte**: Zusätzliche Bewertung neben der Tabelle
- **Vorbildfunktion**: Die Kinder lernen durch die Erwachsenen vor Ort

**Fairplay-Feature in der App:**
- Nach jedem Spiel: Trainer trägt Ergebnis ein
- Optional: Fairplay-Button (🤝 "Wir haben fair gespielt")
- Fairplay-Banner für Teams die sich besonders vorbildlich verhalten haben
- Keine Disziplinar-Mappe – es geht um die Botschaft

### 5. Supabase & Hosting 🚀

#### Was ist Supabase?
Supabase ist eine **open-source Alternative zu Firebase**. Es bietet alles was wir brauchen:

| Feature | Was es ist | Kostenlos? |
|---|---|---|
| **PostgreSQL DB** | Vollständige relationale Datenbank | ✅ 500 MB |
| **Auth** | Email/Password, Magic Links, Social Login | ✅ Unbegrenzt Users |
| **Realtime** | Live-Updates ohne Polling (WebSocket) | ✅ 200 Verbindungen |
| **Storage** | Dateien hochladen (Logos, etc.) | ✅ 1 GB |
| **API** | Automatisch generierte REST + GraphQL API | ✅ Inklusive |

**Kosten:** Kompletter Free Tier = **0€/Monat** – perfekt für unser Turnier!

#### Vercel Hosting
Vercel hostet unsere Next.js App kostenlos:

| Feature | Kostenlos? |
|---|---|
| **Bandwidth** | 100 GB/Monat |
| **Serverless Functions** | Unbegrenzt |
| **Edge Functions** | 100K/Tag |
| **Custom Domains** | ✅ Unbegrenzt |
| **CI/CD** | Automatisches Deploy bei Git-Push | ✅ |

### 6. GitHub ✅
Bereit! Sag mir einfach das Repo.

---

## 🎨 CI-System – Verstanden & Umgesetzt

### Farbpalette

| Token | HEX | Rolle |
|---|---|---|
| `alabaster` | `#F7F6F2` | Primär-Hintergrund (70%) |
| `sage` | `#3B5E4D` | Leitfarbe, Hauptakzente (20%) |
| `sage-dark` | `#284235` | Hover, Dark-Sektionen |
| `sage-mist` | `#E3EBE6` | Tabellenzeilen, Badges |
| `terracotta` | `#D97757` | Highlights, aktive Zustände (6%) |
| `terracotta-soft` | `#F4E3DC` | Subtile Badges |
| `ochre` | `#E2B86B` | Pokal, Gold, Auszeichnungen (4%) |
| `slate-ink` | `#181B1A` | Typografie Primär |
| `slate-stone` | `#5C6360` | Fließtexte |
| `slate-hairline` | `#DEDCD5` | 1px Trennlinien |
| `paper` | `#FFFFFF` | Karten auf Alabaster |

### Nachtmodus-Farben (berechnet)

| Token | Light | Dark |
|---|---|---|
| Background | `#F7F6F2` | `#121514` |
| Cards | `#FFFFFF` | `#1C211E` |
| Primary | `#3B5E4D` | `#5A8B72` |
| Primary Dark | `#284235` | `#3B5E4D` |
| Secondary | `#E3EBE6` | `#1A221F` |
| Accent | `#D97757` | `#E8947A` |
| Gold | `#E2B86B` | `#F0D296` |
| Text | `#181B1A` | `#E8E6E1` |
| Text Secondary | `#5C6360` | `#9DA3A0` |
| Border | `#DEDCD5` | `#2A302D` |

### Typografie
- **Plus Jakarta Sans** (300–700) → Headlines & Body
- **JetBrains Mono** (400–600) → Metadaten, Spielzeiten, Feldnummern

### Design-Prinzipien
- ❌ Keine Comic-Sans, keine bunten Primärfarben, keine Cliparts
- ✅ Architektur-inspiriert, Schweizer Raster, großzügiger Weißraum
- ✅ Warm, hochwertig, kinderfreundlich
- ✅ Touch-ergonomisch (44px Touch-Flächen)
- ✅ `prefers-reduced-motion` respektieren

---

## 🏗️ Tech-Stack

```
┌─────────────────────────────────────────────────┐
│  Frontend                                       │
│  ┌─────────────────────────────────────────┐    │
│  │  Next.js 16 (App Router)                │    │
│  │  React 19 + React Compiler              │    │
│  │  Tailwind CSS 4 (Turbopack)             │    │
│  │  View Transitions API                   │    │
│  │  FLIP Animations                        │    │
│  │  Native Popover API + <dialog>          │    │
│  │  CSS Scroll-Driven Animations           │    │
│  │  i18n (de / cs)                         │    │
│  └─────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│  Backend / Persistence                          │
│  ┌─────────────────────────────────────────┐    │
│  │  Supabase (FREE)                        │    │
│  │  ├─ PostgreSQL (500 MB)                 │    │
│  │  ├─ Auth (Email + Password)             │    │
│  │  └─ Realtime (200 connections)          │    │
│  └─────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│  Hosting                                        │
│  ┌─────────────────────────────────────────┐    │
│  │  Vercel (FREE)                          │    │
│  │  ├─ 100 GB Bandwidth/Monat              │    │
│  │  ├─ Unlimited Serverless Functions      │    │
│  │  └─ Auto-Deploy von Git Push            │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

**Gesamtkosten: 0€/Monat** 🎉

---

## 📐 Seitenstruktur & Features

### 1. Startseite (Home)

```
┌─────────────────────────────────────────────────┐
│  [Logo] BAMBINI CUP | Spielplan | Gruppen |     │
│         Teams | Infos | 🌙 | 🇩🇪/🇨🇿 | [⚙Login] │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  HERO                                   │    │
│  │  BAMBINI CUP 2026                       │    │
│  │  Kleines Feld. Große Schritte.          │    │
│  │  5. Dezember 2026 · ab 09:00           │    │
│  │  Sporthalle Vilémov                     │    │
│  │  [ Countdown-Timer ]                    │    │
│  │  [ Status: Vorbereitungen / LÄUFT! ]    │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│  │ 10   │ │ 20   │ │  2   │ │ ⚽   │           │
│  │Teams │ │Spiele │ │Felder │ │Gruppen│          │
│  └──────┘ └──────┘ └──────┘ └──────┘           │
│                                                 │
│  ┌──────────────────┐ ┌──────────────────┐      │
│  │ NÄCHSTES SPIEL   │ │ GRUPPE A         │      │
│  │ [Live-Highlight] │ │ [Team Cards +    │      │
│  │   FLIP-Anim.]    │ │  Logos]          │      │
│  └──────────────────┘ └──────────────────┘      │
│                                                 │
│  ┌──────────────────┐ ┌──────────────────┐      │
│  │ GRUPPE B         │ │ GELÄNDEPLAN      │      │
│  │ [Team Cards]     │ │ [SVG Map]        │      │
│  └──────────────────┘ └──────────────────┘      │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ FOOTER: SV Fortschritt Großharthau      │    │
│  │ Kontakt | Impressum | © 2026           │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

### 2. Spielplan (Interaktiv)

```
┌─────────────────────────────────────────────────┐
│  [Alle] [Gruppe A] [Gruppe B] [Playoffs]        │
│  [Feld A] [Feld B]  [⚙Edit-Modus: AUS/AN]      │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  09:15 │ FELD A │ Varnsdorf vs Vilémov  │    │
│  │        │        │  0 : 0                 │    │
│  │        │        │ [+1] [−1] [+1] [−1]   │    │
│  └─────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────┐    │
│  │  09:15 │ FELD B │ SFA Jiřetín vs       │    │
│  │        │        │  Union Děčín          │    │
│  │        │        │ [+1] [−1] [+1] [−1]   │    │
│  └─────────────────────────────────────────┘    │
│  ... (weitere Spiele)                           │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  PLAYOFFS (nach 12:00)                  │    │
│  │  ┌─────────┐   ┌─────────┐              │    │
│  │  │ Platzhalter │   │ Platzhalter │         │    │
│  │  └─────────┘   └─────────┘              │    │
│  │  [Kommt nach Vorrunde]                   │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

**Features:**
- **FLIP-Animationen** beim Filtern (Team, Feld, Gruppe)
- **View Transitions** beim Tab-Wechsel
- **Edit-Modus** nach Login: Score als +/- Buttons (touch-friendly)
- **Auto-Berechnung**: Nach Score-Eintrag → Gruppenstand + Playoff-Qualifikation
- **Live-Update**: Supabase Realtime push changes
- **Fairplay-Button**: 🤝 Team hat fair gespielt

### 3. Gruppenstände

#### Gruppe A Matrix
```
┌─────────────┬─────┬───────┬───────┬───────┬────────┬─────┬─────┐
│ Team        │ V   │ Š B   │ Č A   │ G   │ Vil    │ Pkt │ Pl. │
├─────────────┼─────┼───────┼───────┼───────┼────────┼─────┼─────┤
│ Varnsdorf   │  X  │       │       │     │        │  0  │ 1   │
│ Šluknov B   │     │   X   │       │     │        │  0  │ 2   │
│ Česká Lípa A│     │       │   X   │     │        │  0  │ 3   │
│ Grossharthau│     │       │       │  X  │        │  0  │ 4   │
│ Vilémov     │     │       │       │     │    X   │  0  │ 5   │
└─────────────┴─────┴───────┴───────┴───────┴────────┴─────┴─────┘
```

#### Gruppe B Matrix
```
┌─────────────┬───────┬────────┬───────┬───────┬────────┬─────┬─────┐
│ Team        │ SFA   │ Neu    │ Š A   │ Č B   │ UD     │ Pkt │ Pl. │
├─────────────┼───────┼────────┼───────┼───────┼────────┼─────┼─────┤
│ SFA Jiřetín │   X   │        │       │       │        │  0  │ 1   │
│ Neusalza    │       │    X   │       │       │        │  0  │ 2   │
│ Šluknov A   │       │        │   X   │       │        │  0  │ 3   │
│ Česká Lípa B│       │        │       │   X   │        │  0  │ 4   │
│ Union Děčín │       │        │       │       │    X   │  0  │ 5   │
└─────────────┴───────┴────────┴───────┴───────┴────────┴─────┴─────┘
```

### 4. Teams / Mannschaften
- Karten-Grid mit Team-Namen
- `<dialog>` Popover mit Team-Details
- Logos der Teams (wenn online verfügbar)
- Initialen-Platzhalter für Teams ohne Logo

### 5. Infos
- Turnier-Regeln & Fairplay-Kodex
- Geländeplan (SVG)
- Verpflegung
- Kontaktdaten
- Organisatoren

### 6. Login / Admin
- Registrierung: Email + Passwort
- Login: Email + Passwort
- Nur authed: Edit-Score, ändern Spielplan

---

## 🗄️ Datenbank-Schema (Supabase)

```sql
-- Spielplan
CREATE TABLE matches (
  id BIGSERIAL PRIMARY KEY,
  match_no INTEGER UNIQUE,       -- 1–20 (Vorrunde), 21+ (Playoffs)
  time TIME,                      -- 09:15, 09:30, etc.
  pitch CHAR(1),                  -- 'A' or 'B'
  group_name CHAR(1),             -- 'A' or 'B', NULL für Playoffs
  phase TEXT DEFAULT 'group',     -- 'group' | 'play_in' | 'quarterfinal' | 'semifinal' | 'final' | 'bronze'
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INTEGER DEFAULT NULL,  -- NULL = noch nicht gespielt
  away_score INTEGER DEFAULT NULL,
  status TEXT DEFAULT 'scheduled',  -- 'scheduled' | 'live' | 'finished'
  fairplay BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gruppenstände (computed, aber für schnellen Zugriff materialisiert)
CREATE TABLE standings (
  id BIGSERIAL PRIMARY KEY,
  team_name TEXT UNIQUE,
  group_name CHAR(1),             -- 'A' or 'B'
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  fairplay_points INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playoffs
CREATE TABLE playoffs (
  id BIGSERIAL PRIMARY KEY,
  match_no INTEGER,
  round TEXT,                     -- 'play_in_1', 'play_in_2', 'quarterfinal_1-4', 'semifinal_1-2', 'final', 'bronze'
  home_team TEXT,                 -- kann NULL sein (= offen)
  away_team TEXT,                 -- kann NULL sein (= offen)
  home_score INTEGER,
  away_score INTEGER,
  winner_team TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit-Log (wer hat was geändert)
CREATE TABLE edits (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  match_id BIGINT REFERENCES matches(id),
  old_home_score INTEGER,
  new_home_score INTEGER,
  old_away_score INTEGER,
  new_away_score INTEGER,
  fairplay BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔐 Authentifizierung (Supabase Auth)

### Workflow
```
1. User besucht Seite → normale Leserechte
2. Klick auf "Editieren" (⚙) → Redirect /login
3. Login/Signup Formular (Email + Passwort)
4. Nach Login: Edit-Symbole erscheinen
5. Score-Eingabe bei jedem Spiel
6. Auto-Berechnung aller Tabellen
7. Logout über Navbar
```

### Implementation
- **Supabase Auth** (Email + Password)
- Server-Protected Route Handler (API Routes)
- Client-Side Session via Supabase JS Client
- RLS Policies: Nur authed users können `matches` updaten
- Password-Reset via Email
- Session-Management (Auto-Logout nach 30 Min)

---

## 🎬 Animationen & UX

### View Transitions API
```js
document.startViewTransition(() => {
  updateContent('teams');
});
```
- Tab-Wechsel mit Morph-Effekt
- Team-Cards öffnen sich organisch
- Filter-Übergänge ohne hartes "Verschwinden"

### FLIP-Animationen
```js
function flipFilter(team) {
  const first = card.getBoundingClientRect();
  // Filter anwenden, DOM updaten ...
  const last = card.getBoundingClientRect();
  const invert = {
    transform: `translate(${first.left - last.left}px, ${first.top - last.top}px)`
  };
  card.style.transition = 'none';
  card.style.transform = invert.transform;
  requestAnimationFrame(() => {
    card.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.transform = '';
  });
}
```

### CSS Scroll-Driven Animations
```css
.match-card {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Micro-Interactions
- Hover auf Cards: `translateY(-2px)`
- Score-Buttons: Federnder Click-Effekt
- Live-Spielplan-Highlight: Pulsierender Rand
- Nachtmodus-Switch: Smooth Farbe-Übergang
- Fairplay-Button: 🤝 Konfetti-Animation

---

## 🌙 Nachtmodus (Tag/Nacht-Switch)

**Implementierung:**
- CSS Custom Properties (Design Tokens)
- Toggle in der Navbar
- `prefers-color-scheme` als Fallback
- Preference wird in `localStorage` gespeichert

**Farbtransition:**
```css
* {
  transition: background-color 0.3s ease, color 0.3s ease,
              border-color 0.3s ease, box-shadow 0.3s ease;
}
```

---

## 🌐 Internationalisierung (i18n)

### Sprachen
- **Deutsch (de)** – Standard
- **Tschechisch (cs)** – Alternative

### Implementation
- Next.js App Router mit `next-intl`
- JSON-Dateien für Übersetzungen
- Sprach-Switch in Navbar (🇩🇪 / 🇨🇿)
- Alle UI-Strings zentral in JSON

---

## 📁 Projekt-Struktur

```
tournament-planner/
├── info/                          # Turnier-Informationen
├── public/
│   ├── logos/                     # Team-Logos
│   ├── svf-logo.svg
│   └── tournament-logo.svg
├── src/
│   ├── app/
│   │   ├── (de)/                  # Deutsche Route-Gruppe
│   │   │   ├── page.js            # Startseite
│   │   │   ├── layout.js          # Layout mit Navbar
│   │   │   ├── spielplan/
│   │   │   ├── gruppen/
│   │   │   ├── teams/
│   │   │   ├── infos/
│   │   │   └── login/
│   │   ├── (cs)/                  # Tschechische Route-Gruppe
│   │   ├── api/                   # API Routes
│   │   ├── globals.css            # Tailwind + CSS Tokens
│   │   └── favicon.ico
│   ├── components/
│   │   ├── Layout/
│   │   ├── Hero/
│   │   ├── Spielplan/
│   │   ├── Gruppenstand/
│   │   ├── Teams/
│   │   ├── Infos/
│   │   └── Shared/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── calculations.js
│   │   └── translations/
│   └── styles/
├── package.json
├── next.config.mjs
├── tailwind.config.ts
└── README.md
```

---

## 🔧 Implementation-Reihenfolge (Phasen)

### Phase 1: Setup & Grundgerüst
1. [ ] Supabase-Projekt erstellen + Schema aufsetzen
2. [ ] Tailwind CSS mit CI-Token konfigurieren
3. [ ] Navbar mit ThemeToggle + LanguageSwitch
4. [ ] Grundlayout mit Footer
5. [ ] i18n (de/cs) einrichten

### Phase 2: Startseite
6. [ ] Hero-Sektion mit Countdown-Timer
7. [ ] Quick-Stats-Bar
8. [ ] Nächstes-Spiel-Highlight
9. [ ] Quick-Links zu Spielplan/Teams/Gruppen

### Phase 3: Spielplan
10. [ ] MatchCard-Komponente (lesbar)
11. [ ] MatchEditor (nach Login)
12. [ ] Filter (Gruppe, Feld, Team)
13. [ ] FLIP-Animationen für Filter
14. [ ] View Transitions zwischen Tabs

### Phase 4: Gruppenstände
15. [ ] StandTable Komponente
16. [ ] StandMatrix (Dreiecks-Matrix)
17. [ ] Auto-Berechnung bei Score-Update
18. [ ] Realtime-Updates via Supabase

### Phase 5: Teams
19. [ ] TeamGrid mit TeamCards
20. [ ] TeamDialog mit Details
21. [ ] Team-Logos (von fclogo.top / Wikipedia)

### Phase 6: Playoffs (Platzhalter)
22. [ ] Playoff-Bracket-Visualisierung (Platzhalter)
23. [ ] Automatische Setzung nach Vorrunde (kommt später)
24. [ ] Halbfinale, Finale, Kleines Finale (Platzhalter)

### Phase 7: Infos & Details
25. [ ] Geländeplan (SVG)
26. [ ] Turnier-Regeln
27. [ ] Verpflegung
28. [ ] Kontakt & Organisatoren

### Phase 8: Auth & Feinschliff
29. [ ] Login/Signup-Seite
30. [ ] Auth-Guards
31. [ ] Nachtmodus (vollständig)
32. [ ] View Transitions überall
33. [ ] Performance-Optimierung
34. [ ] Accessibility (ARIA, Keyboard-Navi)
35. [ ] Testing auf Mobile

---

## 🚀 Hosting-Plan: Was du tun musst

### Schritt 1: Supabase-Projekt erstellen
1. Gehe auf [supabase.com](https://supabase.com)
2. Klicke "Start your project"
3. Erstelle ein neues Projekt (kostenlos)
4. Wähle Region: **EU (Frankfurt)** für beste Performance in DE/CZ
5. Merke dir:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **API Key (anon/public)**
   - **Database Password**

### Schritt 2: GitHub-Repo
1. Erstelle ein neues Repo auf GitHub
2. Gib mir den Link
3. Ich pushe den Code

### Schritt 3: Vercel-Deploy
1. Gehe auf [vercel.com](https://vercel.com)
2. Verbinde dein GitHub-Account
3. Importiere das Repo
4. Füge die Environment Variables hinzu:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Klicke "Deploy" → Fertig! 🎉

### Automatisches Deployment
- **Jeder Git Push** → Vercel deployt automatisch
- **Jede PR** → Vercel erstellt eine Preview
- **Production Branch** → Live-Deployment

---

## 🎯 Nächste Schritte

1. **Du erstellst:**
   - Supabase-Projekt (supabase.com)
   - GitHub-Repo
   - Vercel-Account (falls noch nicht vorhanden)

2. **Du gibst mir:**
   - GitHub-Repo-Link
   - Supabase URL + API Key
   - Evtl. Vercel Team-Invite

3. **Ich beginne mit Phase 1:** Setup & Grundgerüst
