-- ============================================
-- 003: add archived column to tournament_guest_tokens
-- ============================================
-- Spalte für die Archivierung von Gast-Token.
-- Nach Archivierung zeigt die Gast-View die
-- Finale-Zusammenfassung (Gold/Silber/Bronze).

ALTER TABLE tournament_guest_tokens
  ADD COLUMN archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Index für schnelle Abfragen nach archivierten Tokens
CREATE INDEX idx_guest_token_archived
  ON tournament_guest_tokens (archived);
