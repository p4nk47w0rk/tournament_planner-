-- ============================================
-- 002: tournament_guest_tokens
-- ============================================
-- Tabelle für Gast-Token (QR-Code Sharing)
-- Jeder Token ist ein einzigartiger, 16-stelliger hex-String
-- der einen öffentlich zugänglichen Gast-Link zu einem Turnier
-- ermöglicht.

-- Tabelle erstellen
CREATE TABLE IF NOT EXISTS tournament_guest_tokens (
  id BIGSERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL CHECK (token ~ '^[0-9a-f]{16}$'),
  tournament_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index für schnelle Abfragen nach Turnier
CREATE INDEX idx_guest_token_tournament
  ON tournament_guest_tokens (tournament_slug);

-- Realtime aktivieren
ALTER TABLE tournament_guest_tokens ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Jeder kann Gast-Token lesen (Gast-View ist öffentlich)
CREATE POLICY "Anyone can read tokens"
  ON tournament_guest_tokens
  FOR SELECT
  USING (true);

-- Nur authentifizierte Nutzer können Tokens erstellen (Turnier-Organizer)
CREATE POLICY "Authenticated users can insert tokens"
  ON tournament_guest_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Nur authentifizierte Nutzer können Tokens aktualisieren
CREATE POLICY "Authenticated users can update tokens"
  ON tournament_guest_tokens
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
