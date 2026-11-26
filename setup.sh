#!/usr/bin/env bash
#
# Tournament Planner — Lokales Setup & Start
#
# Anforderungen: Docker, pnpm, Node.js 22+
#
# Usage:
#   ./setup.sh              # Alles aufsetzen und starten
#   ./setup.sh db           # Nur Docker Postgres starten
#   ./setup.sh dev          # Nur pnpm dev starten (DB muss laufen)
#   ./setup.sh stop         # Docker stoppen
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# ── Farben ──────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

info()  { echo -e "${GREEN}✓${NC} $1"; }
warn()  { echo -e "${YELLOW}⚠${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1" >&2; }

# ── Prerequisites prüfen ───────────────────────────────
check_docker() {
  if command -v docker &>/dev/null && docker info &>/dev/null; then
    info "Docker $(docker --version)"
  else
    error "Docker nicht installiert oder nicht gestartet."
    echo "  macOS:   https://docs.docker.com/desktop/install/mac-install/"
    echo "  Linux:   sudo apt install docker.io"
    exit 1
  fi
}

check_pnpm() {
  if command -v pnpm &>/dev/null; then
    info "pnpm $(pnpm --version)"
  else
    warn "pnpm nicht gefunden. Installiere..."
    if command -v npm &>/dev/null; then
      npm install -g pnpm
      info "pnpm $(pnpm --version)"
    else
      error "npm nicht gefunden. Bitte zuerst Node.js installieren."
      exit 1
    fi
  fi
}

check_node() {
  if command -v node &>/dev/null; then
    local nodeVersion
    nodeVersion=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$nodeVersion" -ge 22 ]; then
      info "Node.js $(node -v)"
    else
      warn "Node.js $nodeVersion erkannt. Empfohlen: 22+"
    fi
  else
    error "Node.js nicht installiert."
    echo "  https://nodejs.org (LTS oder Current)"
    exit 1
  fi
}

# ── .env.local erstellen ───────────────────────────────
setup_env() {
  if [ -f ".env.local" ]; then
    info ".env.local existiert bereits"
    return
  fi

  # Supabase anon key für lokalen Docker (standard JWT secret)
  local anon_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43ddQ6ko_oNs_3n_kV4Y_v20"

  cat > .env.local <<EOF
# Supabase Configuration (local dev)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anon_key}

# For production, replace with your Supabase project URL and keys:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
EOF

  info ".env.local erstellt (lokaler Supabase)"
}

# ── Docker Postgres starten ───────────────────────────
start_db() {
  info "Starte PostgreSQL via Docker Compose..."
  docker compose up -d

  # Auf Healthcheck warten
  echo -n "  Warte auf Datenbank..."
  for i in $(seq 1 30); do
    if docker compose exec -T db pg_isready -U postgres &>/dev/null; then
      echo ""
      info "Datenbank bereit (Port 54321)"
      return
    fi
    echo -n "."
    sleep 1
  done

  error "Datenbank konnte nicht starten."
  docker compose logs db
  exit 1
}

stop_db() {
  info "Stoppe PostgreSQL..."
  docker compose down
}

# ── pnpm install ──────────────────────────────────────
install_deps() {
  if [ -d "node_modules" ]; then
    info "node_modules existiert bereits"
    return
  fi

  info "Installiere Dependencies..."
  pnpm install
}

# ── Dev Server starten ────────────────────────────────
start_dev() {
  info "Starte Next.js Dev Server (Turbopack)..."
  pnpm dev
}

# ── Hauptlogik ────────────────────────────────────────
case "${1:-all}" in
  all)
    check_docker
    check_node
    check_pnpm
    setup_env
    start_db
    install_deps
    start_dev
    ;;
  db)
    check_docker
    start_db
    ;;
  stop)
    stop_db
    ;;
  dev)
    setup_env
    install_deps
    start_dev
    ;;
  *)
    echo "Usage: $0 {all|db|stop|dev}"
    echo ""
    echo "  all  - Alles einrichten und starten (Default)"
    echo "  db   - Nur PostgreSQL via Docker starten"
    echo "  stop - Docker stoppen"
    echo "  dev  - Nur Dev Server starten"
    exit 1
    ;;
esac
