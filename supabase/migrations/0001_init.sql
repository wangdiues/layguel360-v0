-- ───────────────────────────────────────────────────────────────────────────
-- 0001_init.sql — initial Layguel360 schema
--
-- Scope: the 5 entities used by the Version-0 UI (projects, tasks, comments,
-- attachments, profiles). Phase-4 of the implementation plan introduces the
-- multi-tenant model (organizations, programs, members) in a follow-up
-- migration; THIS migration intentionally pre-tightens RLS to "authenticated
-- only" so the historical wide-open `USING (true)` policies never reach a
-- deployed environment.
--
-- profiles.id PK references auth.users(id) directly (Supabase idiom) so
-- policies can write `auth.uid() = profiles.id` without an extra join.
-- ───────────────────────────────────────────────────────────────────────────

-- ── Helpers ────────────────────────────────────────────────────────────────

-- Set updated_at on row update (used by every entity table).
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ── Profiles ───────────────────────────────────────────────────────────────
-- One row per Supabase Auth user. id == auth.users.id.

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  role        TEXT,
  department  TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Projects ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'Planning',
  priority    TEXT NOT NULL DEFAULT 'Medium',
  start_date  DATE,
  end_date    DATE,
  department  TEXT,
  manager     TEXT,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_status_idx     ON public.projects (status);
CREATE INDEX IF NOT EXISTS projects_priority_idx   ON public.projects (priority);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON public.projects (created_at DESC);

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Tasks ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'Pending',
  priority    TEXT NOT NULL DEFAULT 'Medium',
  due_date    DATE,
  assignee    TEXT,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON public.tasks (project_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx     ON public.tasks (status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx   ON public.tasks (priority);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx   ON public.tasks (due_date);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks (created_at DESC);

CREATE TRIGGER tasks_set_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Comments ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  author_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author      TEXT NOT NULL,
  text        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS comments_task_id_idx    ON public.comments (task_id, created_at);
CREATE INDEX IF NOT EXISTS comments_author_id_idx  ON public.comments (author_id);

-- ── Attachments ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.attachments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id       UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  uploader_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  filename      TEXT NOT NULL,
  file_type     TEXT,
  file_size     TEXT,
  storage_path  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS attachments_task_id_idx     ON public.attachments (task_id, created_at);
CREATE INDEX IF NOT EXISTS attachments_uploader_id_idx ON public.attachments (uploader_id);

-- ── Row Level Security ─────────────────────────────────────────────────────
-- Phase-1 lockdown: every action requires an authenticated session.
-- Phase-4 will replace these with org-scoped policies via *_members tables.

ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- Profiles: any authenticated user can read; users may only edit their own row.
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "profiles_insert_self"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_self"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Projects: any authenticated user can read and create; only the creator can update/delete.
CREATE POLICY "projects_select_authenticated"
  ON public.projects FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "projects_insert_authenticated"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND (created_by IS NULL OR created_by = auth.uid()));

CREATE POLICY "projects_update_creator"
  ON public.projects FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "projects_delete_creator"
  ON public.projects FOR DELETE
  USING (auth.uid() = created_by);

-- Tasks: same shape as projects (creator-owned).
CREATE POLICY "tasks_select_authenticated"
  ON public.tasks FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "tasks_insert_authenticated"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND (created_by IS NULL OR created_by = auth.uid()));

CREATE POLICY "tasks_update_creator"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "tasks_delete_creator"
  ON public.tasks FOR DELETE
  USING (auth.uid() = created_by);

-- Comments: read by any authenticated user; only the author can edit/delete their own.
CREATE POLICY "comments_select_authenticated"
  ON public.comments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "comments_insert_authenticated"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND (author_id IS NULL OR author_id = auth.uid()));

CREATE POLICY "comments_update_author"
  ON public.comments FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "comments_delete_author"
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id);

-- Attachments: read by any authenticated user; only uploader can delete.
CREATE POLICY "attachments_select_authenticated"
  ON public.attachments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "attachments_insert_authenticated"
  ON public.attachments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND (uploader_id IS NULL OR uploader_id = auth.uid()));

CREATE POLICY "attachments_delete_uploader"
  ON public.attachments FOR DELETE
  USING (auth.uid() = uploader_id);
