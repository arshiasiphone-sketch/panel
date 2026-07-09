-- ============================================================
-- Part 9: Provisioning Tables — Blueprints, Transactions, Steps
--
-- This migration creates the database infrastructure needed
-- for the public provisioning system (Part 9).
--
-- Tables:
--   - blueprints:       stores available blueprint definitions
--   - provision_transactions: tracks each provisioning attempt
--   - provision_steps:  individual steps within a transaction
-- ============================================================

-- 1. Blueprints — reusable templates for workspaces
CREATE TABLE IF NOT EXISTS public.blueprints (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text NOT NULL UNIQUE,
  version       text NOT NULL,
  name          text NOT NULL,
  description   text DEFAULT '',
  category      text NOT NULL DEFAULT 'general',
  manifest      jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.blueprints IS 'Available blueprints that can be used to provision new workspaces';
COMMENT ON COLUMN public.blueprints.manifest IS 'JSON: full blueprint definition (pages, blocks, theme, menus, etc.)';

-- 2. Provision transactions — top-level record of each provisioning attempt
CREATE TABLE IF NOT EXISTS public.provision_transactions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      uuid REFERENCES public.workspaces(id) ON DELETE SET NULL,
  blueprint_id      uuid REFERENCES public.blueprints(id) ON DELETE SET NULL,
  blueprint_slug    text,
  blueprint_version text NOT NULL,
  status            text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'rolling_back', 'rolled_back')),
  initiated_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at        timestamptz NOT NULL DEFAULT now(),
  completed_at      timestamptz,
  error             text,
  logs              jsonb NOT NULL DEFAULT '[]'::jsonb
);

COMMENT ON TABLE public.provision_transactions IS 'Tracks each provisioning attempt with status and metadata';

-- 3. Provision steps — individual step records within a transaction
CREATE TABLE IF NOT EXISTS public.provision_steps (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.provision_transactions(id) ON DELETE CASCADE,
  step_name     text NOT NULL,
  step_index    int NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  started_at    timestamptz NOT NULL DEFAULT now(),
  completed_at  timestamptz,
  duration_ms   bigint DEFAULT 0,
  error         text,
  output        jsonb DEFAULT '{}'::jsonb
);

COMMENT ON TABLE public.provision_steps IS 'Individual provisioning steps within a transaction';

-- ─── Indexes ─────────────────────────────────────────────────────

-- Look up transactions by workspace
CREATE INDEX IF NOT EXISTS idx_provision_transactions_workspace
  ON public.provision_transactions(workspace_id) WHERE workspace_id IS NOT NULL;

-- Look up transactions by status
CREATE INDEX IF NOT EXISTS idx_provision_transactions_status
  ON public.provision_transactions(status);

-- Look up steps by transaction
CREATE INDEX IF NOT EXISTS idx_provision_steps_transaction
  ON public.provision_steps(transaction_id);

-- Look up steps by step name
CREATE INDEX IF NOT EXISTS idx_provision_steps_step_name
  ON public.provision_steps(step_name);

-- ─── RLS Policies ──────────────────────────────────────────────

ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provision_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provision_steps ENABLE ROW LEVEL SECURITY;

-- Blueprints: everyone can read (public catalog)
CREATE POLICY "Blueprints are publicly readable"
  ON public.blueprints FOR SELECT
  USING (true);

-- Blueprints: only authenticated users / service role can write
CREATE POLICY "Blueprints are manageable by auth users"
  ON public.blueprints
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Provision transactions: owner and admins
CREATE POLICY "Users can read own provision transactions"
  ON public.provision_transactions FOR SELECT
  USING (
    auth.uid() = initiated_by
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Users can insert own provision transactions"
  ON public.provision_transactions FOR INSERT
  WITH CHECK (auth.uid() = initiated_by);

-- Provision steps: read alongside transaction access
CREATE POLICY "Steps inherit transaction read access"
  ON public.provision_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.provision_transactions pt
      WHERE pt.id = provision_steps.transaction_id
        AND (pt.initiated_by = auth.uid() OR auth.role() = 'service_role')
    )
    OR auth.role() = 'service_role'
  );

-- ─── Seed: default cafeteria blueprint ────────────────────────

INSERT INTO public.blueprints (slug, version, name, description, category, manifest)
VALUES (
  'cafeteria',
  '1.0.0',
  'Café Starter Kit',
  'A complete starter kit for cafés including menu, gallery, personality quiz, testimonials, and events pages.',
  'restaurant',
  '{
    "id": "blueprint-cafeteria-default",
    "slug": "cafeteria",
    "version": "1.0.0",
    "name": "Café Starter Kit",
    "description": "A complete starter kit for cafés.",
    "category": "restaurant",
    "pages": [
      {"key": "home", "title": "Home", "path": "/", "blockKeys": ["hero-home"]},
      {"key": "menu", "title": "Menu", "path": "/menu", "blockKeys": ["gallery-menu"]},
      {"key": "quiz", "title": "Personality Quiz", "path": "/quiz", "blockKeys": ["personality-quiz-section"]},
      {"key": "testimonials", "title": "Testimonials", "path": "/testimonials", "blockKeys": ["testimonials-list"]},
      {"key": "events", "title": "Events", "path": "/events", "blockKeys": ["events-list"]}
    ],
    "theme": {
      "presetId": "cafe-rose-gold",
      "overrides": {"primaryColor": "#9f1239", "accentColor": "#d4af37"}
    },
    "menus": [
      {"name": "Espresso", "category": "Hot Coffee", "price": "35000"},
      {"name": "Cappuccino", "category": "Hot Coffee", "price": "45000"},
      {"name": "Caramel Latte", "category": "Specialty Coffee", "price": "50000"}
    ]
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;