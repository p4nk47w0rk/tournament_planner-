# Tournament Planner – Sportverwaltung

Eine moderne Next.js 16 App für die sportliche Vereinsverwaltung.

## 🚀 Schnellstart

### Lokal starten (macOS / Linux)

```bash
./setup.sh
```

Das Skript prüft die Abhängigkeiten, startet PostgreSQL via Docker und startet den Dev-Server.

**Manuelle Schritte:**

```bash
# 1. Datenbank starten
docker compose up -d

# 2. Dependencies installieren
pnpm install

# 3. Environment variables erstellen
#    .env.local wird automatisch vom Setup-Skript erstellt

# 4. Dev Server starten
pnpm dev
```

### Windows

```powershell
# Powershell (Git Bash / WSL empfohlen)
docker compose up -d
pnpm install
# .env.local manuell erstellen (siehe unten)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) mit deinem Browser.

## 📋 Voraussetzungen

| Tool | Mindestversion | Prüfung |
|------|---------------|---------|
| [Docker](https://docs.docker.com/get-docker/) | 24+ | `docker --version` |
| [Node.js](https://nodejs.org) | 22+ | `node -v` |
| [pnpm](https://pnpm.io) | 9+ | `pnpm --version` |

## ⚙️ Environment Variables

Das Setup-Skript erstellt automatisch `.env.local`. Für die Produktion:

```bash
# .env.local (lokal)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<dein-local-anon-key>

# .env.local (produktiv auf Vercel)
NEXT_PUBLIC_SUPABASE_URL=https://<projekt>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<dein-production-anon-key>
```

## 🛠 Verfügbare Scripts

| Script | Beschreibung |
|--------|-------------|
| `./setup.sh` | Alles einrichten und starten |
| `./setup.sh db` | Nur PostgreSQL starten |
| `./setup.sh stop` | Docker stoppen |
| `./setup.sh dev` | Nur Dev Server starten |
| `pnpm dev` | Dev Server (Turbopack) |
| `pnpm build` | Production Build |
| `pnpm start` | Production Server |
| `pnpm lint` | ESLint |
| `pnpm setup:local` | Supabase lokal setup |
| `pnpm supabase:start` | Docker Compose starten |
| `pnpm supabase:stop` | Docker Compose stoppen |
| `pnpm supabase:reset` | Docker reset + neu starten |

## 🏗 Tech Stack

- **[Next.js 16](https://nextjs.org)** – App Router, Turbopack, React Server Components
- **[React 19](https://react.dev)** – mit React Compiler für automatische Memoization
- **[Tailwind CSS 4](https://tailwindcss.com)** – Utility-first CSS mit Turbopack Integration
- **[Supabase](https://supabase.com)** – PostgreSQL, Auth, Realtime
- **[Geist Fonts](https://vercel.com/font)** – Optimierte Typografie von Vercel
- **[ESLint 9](https://eslint.org)** – Flat Config Format
- **[pnpm](https://pnpm.io)** – Schnelles, speichereffizientes Package Management

## 📦 Struktur

```
├── src/
│   ├── app/           # Next.js App Router Pages
│   ├── components/    # UI Komponenten
│   ├── lib/           # Services, Types, Supabase Client
│   └── middleware.ts  # Supabase cookie handling
├── supabase/
│   └── init.sql       # Datenbank Schema
├── docker-compose.yml # PostgreSQL + Supabase local
├── .env.local         # Environment Variables
├── setup.sh           # Lokales Setup-Skript
└── package.json
```

## 🌐 Deployment

Das Projekt ist auf [Vercel](https://vercel.com) konfiguriert für Auto-Deploy bei GitHub Push.

1. Repo auf Vercel importieren
2. Environment Variables eintragen (Supabase URLs/Keys)
3. Vercel deployed automatisch bei jedem Push auf `main`

## 📝 Upgrade-Pakete

Neue Versionen prüfen mit:

```bash
pnpm outdated
pnpm update    # minor/patch upgraden
```
