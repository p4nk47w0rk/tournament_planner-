-- ============================================
-- Bambini Cup 2026 — Supabase Database Schema
-- Initial migration: all tables, RLS, seed data
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Matches (Spielplan)
-- ============================================
CREATE TABLE IF NOT EXISTS matches (
  id BIGSERIAL PRIMARY KEY,
  match_no INTEGER UNIQUE NOT NULL,
  time TIME NOT NULL,
  pitch CHAR(1) NOT NULL CHECK (pitch IN ('A', 'B')),
  group_name CHAR(1) NOT NULL CHECK (group_name IN ('A', 'B')),
  phase TEXT NOT NULL DEFAULT 'group' CHECK (phase IN ('group', 'play_in', 'quarterfinal', 'semifinal', 'final', 'bronze')),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished')),
  fairplay BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Standings (Gruppenstände)
-- ============================================
CREATE TABLE IF NOT EXISTS standings (
  id BIGSERIAL PRIMARY KEY,
  team_name TEXT NOT NULL,
  group_name CHAR(1) NOT NULL CHECK (group_name IN ('A', 'B')),
  played INTEGER NOT NULL DEFAULT 0,
  won INTEGER NOT NULL DEFAULT 0,
  drawn INTEGER NOT NULL DEFAULT 0,
  lost INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  goal_difference INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  fairplay_points INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_name)
);

-- ============================================
-- Edits (Audit Log)
-- ============================================
CREATE TABLE IF NOT EXISTS edits (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  match_id BIGINT REFERENCES matches(id) ON DELETE CASCADE,
  old_home_score INTEGER,
  new_home_score INTEGER,
  old_away_score INTEGER,
  new_away_score INTEGER,
  fairplay BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Goals (Tore-Feed)
-- ============================================
CREATE TABLE IF NOT EXISTS goals (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team TEXT NOT NULL,
  minute TEXT NULL,
  player TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_matches_pitch ON matches (pitch);
CREATE INDEX IF NOT EXISTS idx_matches_group ON matches (group_name);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches (status);
CREATE INDEX IF NOT EXISTS idx_matches_time ON matches (time);
CREATE INDEX IF NOT EXISTS idx_standings_group ON standings (group_name);
CREATE INDEX IF NOT EXISTS idx_standings_rank ON standings (rank);
CREATE INDEX IF NOT EXISTS idx_goals_match ON goals (match_id);

-- ============================================
-- Realtime — enable for live updates
-- ============================================
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals FORCE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Anyone can read matches and standings
DO $$ BEGIN
  CREATE POLICY "Anyone can read matches" ON matches FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can read standings" ON standings FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can update matches" ON matches FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert matches" ON matches FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can update standings" ON standings FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert standings" ON standings FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can read edits" ON edits FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Service role can write edits" ON edits FOR INSERT TO service_role WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can read goals" ON goals FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert goals" ON goals FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete goals" ON goals FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- Trigger: auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS matches_updated_at ON matches;
CREATE TRIGGER matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS standings_updated_at ON standings;
CREATE TRIGGER standings_updated_at
  BEFORE UPDATE ON standings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Seed data: Initial matches
-- ============================================
INSERT INTO matches (match_no, time, pitch, group_name, phase, home_team, away_team, status) VALUES
  -- Group A
  (1, '09:15', 'A', 'A', 'group', 'Varnsdorf', 'Vilémov', 'scheduled'),
  (3, '09:30', 'A', 'A', 'group', 'Šluknov B', 'Grossharthau', 'scheduled'),
  (5, '09:45', 'A', 'A', 'group', 'Varnsdorf', 'Česká Lípa A', 'scheduled'),
  (7, '10:00', 'A', 'A', 'group', 'Šluknov B', 'Grossharthau', 'scheduled'),
  (9, '10:15', 'A', 'A', 'group', 'Česká Lípa A', 'Vilémov', 'scheduled'),
  (11, '10:30', 'A', 'A', 'group', 'Varnsdorf', 'Šluknov B', 'scheduled'),
  (13, '10:45', 'A', 'A', 'group', 'Česká Lípa A', 'Grossharthau', 'scheduled'),
  (15, '11:00', 'A', 'A', 'group', 'Šluknov B', 'Vilémov', 'scheduled'),
  (17, '11:15', 'A', 'A', 'group', 'Varnsdorf', 'Grossharthau', 'scheduled'),
  (19, '11:30', 'A', 'A', 'group', 'Vilémov', 'Česká Lípa A', 'scheduled'),
  -- Group B
  (2, '09:15', 'B', 'B', 'group', 'SFA Jiřetín', 'Union Děčín', 'scheduled'),
  (4, '09:30', 'B', 'B', 'group', 'Neusalza', 'Česká Lípa B', 'scheduled'),
  (6, '09:45', 'B', 'B', 'group', 'SFA Jiřetín', 'Šluknov A', 'scheduled'),
  (8, '10:00', 'B', 'B', 'group', 'Neusalza', 'Česká Lípa B', 'scheduled'),
  (10, '10:15', 'B', 'B', 'group', 'Šluknov A', 'Union Děčín', 'scheduled'),
  (12, '10:30', 'B', 'B', 'group', 'SFA Jiřetín', 'Neusalza', 'scheduled'),
  (14, '10:45', 'B', 'B', 'group', 'Šluknov A', 'Česká Lípa B', 'scheduled'),
  (16, '11:00', 'B', 'B', 'group', 'Neusalza', 'Union Děčín', 'scheduled'),
  (18, '11:15', 'B', 'B', 'group', 'SFA Jiřetín', 'Česká Lípa B', 'scheduled'),
  (20, '11:30', 'B', 'B', 'group', 'Union Děčín', 'Šluknov A', 'scheduled');

-- ============================================
-- Seed data: Initialize standings with zeros
-- ============================================
INSERT INTO standings (team_name, group_name, rank) VALUES
  -- Group A
  ('Varnsdorf', 'A', 1),
  ('Šluknov B', 'A', 2),
  ('Česká Lípa A', 'A', 3),
  ('Grossharthau', 'A', 4),
  ('Vilémov', 'A', 5),
  -- Group B
  ('SFA Jiřetín', 'B', 1),
  ('Neusalza', 'B', 2),
  ('Šluknov A', 'B', 3),
  ('Česká Lípa B', 'B', 4),
  ('Union Děčín', 'B', 5)
ON CONFLICT DO NOTHING;
