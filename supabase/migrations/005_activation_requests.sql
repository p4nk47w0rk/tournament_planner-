-- Migration: 005_activation_requests
-- Tracks admin activation requests with approval flow

-- Table: activation_requests
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS activation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    approved_at TIMESTAMPTZ,
    approved_by TEXT
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Index for fast queries
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_activation_requests_status ON activation_requests (status);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- RLS Policies
DO $$ BEGIN
  ALTER TABLE activation_requests ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN insufficient_authorization IN sqlstate THEN null;
END $$;

-- Everyone can INSERT (to create new requests)
DO $$ BEGIN
  CREATE POLICY "Anyone can insert activation requests"
    ON activation_requests FOR INSERT
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Admin-only: SELECT all
DO $$ BEGIN
  CREATE POLICY "Admins can view all activation requests"
    ON activation_requests FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Admin-only: UPDATE (approve/reject)
DO $$ BEGIN
  CREATE POLICY "Admins can update activation requests"
    ON activation_requests FOR UPDATE
    USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Admin-only: DELETE (reject)
DO $$ BEGIN
  CREATE POLICY "Admins can delete activation requests"
    ON activation_requests FOR DELETE
    USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Only allow updating approved/rejected rows (prevent re-approval of rejected)
DO $$ BEGIN
  CREATE POLICY "Only update approved or rejected requests"
    ON activation_requests FOR UPDATE
    USING (status IN ('approved', 'rejected'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Seed: mark any existing approved requests
UPDATE activation_requests SET status = 'approved', approved_at = now(), approved_by = 'system'
WHERE status = 'approved' AND approved_at IS NULL;
