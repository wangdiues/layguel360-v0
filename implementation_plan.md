# Layguel360 World-Class Implementation Plan

> **Status:** Master execution plan. Replaces the previous Phase 0–11 outline.
> **Audience:** Claude Code, Codex CLI, Qwen Code, OpenCode, and human contributors.
> **Last updated:** 2026-05-05 (audit current at this date).

This document separates **what exists today** (verified by direct file inspection) from **what is proposed**. Every "exists" claim is verifiable with `ls`, `cat`, or `grep` against the working tree. Items that could not be confirmed are marked **"Not confirmed from current codebase."**

---

## 1. Executive Summary

### Current state
ལས་འགུལ་360 is a **Version 0 static prototype** built on Next.js 15.3.2 (App Router), React 19.2.4, TypeScript 5, Tailwind CSS v4 (no config file — inline `@theme` in `app/globals.css`), and shadcn/ui (style `radix-nova`). Ten routes render with mock data from `lib/mock-data.ts`. Supabase packages (`@supabase/ssr`, `@supabase/supabase-js`) are installed and a Supabase client/server/admin/data layer scaffold is present in `lib/supabase/`, but **no page imports from it** — the data layer is dead code. Server actions exist as no-op stubs. `middleware.ts` is a passthrough — no route protection. RLS is enabled in `lib/supabase/schema.sql` but every policy is `USING (true)` / `WITH CHECK (true)` — wide open. There is no test infrastructure.

### Target state
A production-grade SaaS project management platform with Supabase Auth, RLS-enforced multi-tenant data isolation, role-based access (owner/admin/manager/contributor/viewer), real-time-ready data fetching via React Server Components, accessible shadcn/ui interface with WCAG 2.1 AA compliance, automated tests (Vitest + Playwright), CI/CD on Vercel + Supabase, observability via Sentry + Vercel Analytics.

### Main transformation strategy
Seven sequential phases (§ 12). Each ends with hard acceptance criteria and a clean `git status`. Phase 4 is the load-bearing one: split `lib/supabase/data.ts` into `queries.server.ts` + `queries.client.ts`, fill in the four no-op server actions, switch every page from `mock-data.ts` to `queries.server.ts`, then **delete `lib/mock-data.ts` in the same commit** to eliminate dual-source drift.

### Top 5 risks
1. **Design-direction conflict** between `CLAUDE.md`/`AGENTS.md` (light theme, indigo/slate, no green) and `app/globals.css` (dark NVIDIA-style with `#00dc82` green primary). Recent commits flip-flop. Must be resolved by the user before § 7 work begins.
2. **Permissive RLS** (`schema.sql` lines 68–78). Shipping with `USING (true)` would expose all rows of all tenants.
3. **`lib/supabase/data.ts` uses the browser client** (`import { createClient } from "@/lib/supabase/client"`). When called from server components after auth lands, queries will run without the user's cookie/session and either return empty results or violate RLS. Must be split before Phase 4 wiring.
4. **No test infrastructure** — every refactor is unverified.
5. **Mock/real dual data sources** — leaving `mock-data.ts` in place after Phase 4 will cause drift the first time the schema diverges.

### Top 5 opportunities
1. Modern foundation already in place (Next 15 RSC, React 19, Tailwind v4) — no migration debt.
2. Data layer is partially written — splitting is cheaper than greenfield.
3. shadcn/ui primitives (13 components) and a custom `status-badge.tsx` are reusable as-is.
4. Schema scaffold (`schema.sql`) gives a head start on the migration.
5. Vercel + Supabase free tier is sufficient for portfolio scale.

---

## 2. Tooling and Inspection Limitations

### Skills referenced in the prompt
The prompt enumerated specialist skills (fullstack-dev, nextjs-app-router, supabase, security-reviewer, etc.). **Availability of those specific skills in this Claude Code environment is not confirmed.** This document was produced using general-purpose Read, Grep, and Explore subagents.

### MCP servers
Configuration of filesystem, git, github, context7, sequential-thinking, supabase, playwright, and memory MCP servers **could not be enumerated in this environment.** The plan does not depend on any of them.

### Files inspected (verified by direct read)
`package.json`, `package-lock.json` (presence only), `next.config.js`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `components.json`, `middleware.ts`, `opencode.json`, `app/layout.tsx`, all 10 page.tsx files, all four `actions.ts` files, every file under `components/`, `lib/utils.ts`, `lib/mock-data.ts`, `lib/supabase/{client,server,admin,data}.ts`, `lib/supabase/schema.sql`, `app/globals.css`, `README.md`, `CLAUDE.md`, `AGENTS.md`.

### Files deliberately not inspected
`.env.local` (security), `node_modules/`, `.next/`, `concept_note.md`, `product_design.md`, `PROJECT_LOG.md`, the prior `implementation_plan.md` (now overwritten by this document). The **code is the source of truth**, not prior planning notes.

### Commands run during audit
None. Read-only inspection via Read/Grep/Explore.

### Working-tree state at audit time
- Branch: `main`, **16 commits ahead** of `origin/main`.
- 10 modified files unstaged; `opencode.json` untracked.
- Last 4 commits: `a5396dc glassmorphism`, `eca2564 restore canvas`, `51e8476 restore dark NVIDIA green`, `e18c44d clean light theme indigo/slate` — direct evidence of the design oscillation.

### Unconfirmed items
- Whether the running app currently builds without errors (`npm run build` not executed).
- Whether the existing Supabase schema has been applied to a real Supabase project (likely yes given `.env.local` exists, but contents unread).
- Existence of any CI workflow (`.github/workflows/` not inspected here).

---

## 3. Current Codebase Assessment

### Framework and versions

| Concern | Value |
|---|---|
| Framework | Next.js **15.3.2**, App Router (no `pages/` directory) |
| React | 19.2.4 |
| TypeScript | 5 (strict mode, target ES2017, bundler resolution) |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`), no `tailwind.config.*` — inline `@theme` in `app/globals.css` |
| Component lib | shadcn/ui v4.6.0, style `radix-nova`, RSC enabled, base color `neutral` |
| Icons | `lucide-react@1.14.0` |
| Primitives | `radix-ui@1.4.3` |
| Auth/DB | `@supabase/ssr@0.10.2`, `@supabase/supabase-js@2.105.1` (installed, not wired) |
| AI | `@ai-sdk/openai-compatible@2.0.45` (installed, not used; opencode.json wires NVIDIA NIM DeepSeek V4 Flash) |
| Lint | ESLint 9 flat config, `eslint-config-next@16.2.4` |
| Lock file | `package-lock.json` (npm) |
| Tests | None installed |

### Directory tree (top level)

```
app/           # 10 routes, root layout, globals.css, favicon
  api/setup/   # exists, empty (no route handlers)
  dashboard, login, register, profile, projects, projects/[projectId],
  tasks, tasks/[taskId], documents
components/
  comments/CommentList.tsx
  layout/{BackgroundAnimation,LogoutButton,sidebar,topbar}.tsx
  profile/ProfileForm.tsx
  projects/{CreateProjectDialog,ProjectsClient}.tsx
  tasks/{CreateTaskDialog,TasksClient}.tsx
  ui/  # 13 shadcn primitives + custom status-badge.tsx
  uploads/AttachmentList.tsx
lib/
  mock-data.ts                           # 204 lines, used everywhere
  utils.ts                               # cn() helper
  supabase/{client,server,admin,data,schema.sql}
public/        # logo.png (852 KB), default Next svgs
middleware.ts  # passthrough — no auth
next.config.js, tsconfig.json, components.json, opencode.json,
postcss.config.mjs, eslint.config.mjs, README.md, CLAUDE.md, AGENTS.md
```

### Existing routes (verified)

| Route | File | Type | Data source | Lines |
|---|---|---|---|---|
| `/` | `app/page.tsx` | RSC | redirect to `/dashboard` | 5 |
| `/login` | `app/login/page.tsx` | Client | none (mock submit → redirect) | 171 |
| `/register` | `app/register/page.tsx` | Client | none (mock submit → redirect) | 197 |
| `/dashboard` | `app/dashboard/page.tsx` | RSC | `mock-data.ts` | 232 |
| `/projects` | `app/projects/page.tsx` | Client (useState) | `mock-data.ts` | 120 |
| `/projects/[projectId]` | `app/projects/[projectId]/page.tsx` | RSC (async) | `mock-data.ts` | 179 |
| `/tasks` | `app/tasks/page.tsx` | Client (useState) | `mock-data.ts` | 121 |
| `/tasks/[taskId]` | `app/tasks/[taskId]/page.tsx` | RSC (async) | `mock-data.ts` | 187 |
| `/profile` | `app/profile/page.tsx` | RSC | `mock-data.ts` | 134 |
| `/documents` | `app/documents/page.tsx` | RSC | inline static array | 200 |

**Server actions** (all no-ops):
- `app/projects/actions.ts` — `createProject()`
- `app/tasks/actions.ts` — `createTask()`
- `app/tasks/[taskId]/actions.ts` — `postComment()`, `uploadAttachment()`
- `app/profile/actions.ts` — `updateProfile()`

**No `loading.tsx`, `error.tsx`, or `not-found.tsx` anywhere.**
**`app/api/setup/` directory exists but is empty.**
**No `(group)` segments. No `[[catchall]]`.**
**`hooks/` and `types/` directories do not exist** — types live inline in components and in `lib/supabase/data.ts`.

### Strengths
- Modern stack with no legacy debt.
- Server components by default; client components only where interactive.
- shadcn/ui properly configured with CSS variables.
- Schema scaffold + Supabase clients already authored.
- Server-action infrastructure already wired into pages.
- `next.config.js` raises `bodySizeLimit` to 25 MB anticipating file uploads.

### Weaknesses
- Theme conflict between docs and code (see §1, §4, §7).
- `lib/supabase/data.ts` is dead code — zero importers (`grep -rn '@/lib/supabase/data' app components` → no hits).
- `lib/supabase/data.ts` uses the **browser** client (line 1: `import { createClient } from "@/lib/supabase/client"`) — unusable from RSC without a fix.
- RLS policies are wide open (`schema.sql` lines 68–78).
- Seed data is embedded in `schema.sql` — not a clean migration.
- No `.env.example`.
- README is the default Next scaffold and references **Geist** while `app/layout.tsx` uses **Plus Jakarta Sans** — outright misleading.
- 10 modified files uncommitted on `main`; `opencode.json` untracked.
- No tests, no error boundaries, no analytics.

---

## 4. Critical Issues to Fix First

### Issue 1 — Design-direction conflict — **Critical**
- **Where:** `app/globals.css` (lines 53–88) vs `CLAUDE.md` and `AGENTS.md` ("Design rules" sections).
- **Evidence:** Globals defines `--primary: #00dc82` (NVIDIA green) on a `#0a0a0f` near-black canvas with a particle background; docs forbid green and mandate light theme with indigo/blue/slate.
- **Why it matters:** Every UI task downstream depends on which palette is canonical. Recent commits flip back and forth.
- **Fix:** **Block all UI work until the user resolves this.** Two options to present:
  - **A) Honor the docs**: rewrite `globals.css` to a light theme with indigo primary; remove `BackgroundAnimation`; update screenshots.
  - **B) Update the docs**: amend `CLAUDE.md` and `AGENTS.md` to ratify dark-mode + green primary + glassmorphism.
- **Acceptance:** A single source of truth for the palette; no further commits flip-flopping.

### Issue 2 — Permissive RLS policies — **Critical**
- **Where:** `lib/supabase/schema.sql` lines 68–78.
- **Evidence:** Every policy is `USING (true)` / `WITH CHECK (true)`.
- **Why it matters:** Once auth is real, any signed-in user reads every tenant's rows.
- **Fix:** Replace with member-scoped policies tied to `auth.uid()` and the `*_members` join tables (see §9). Move the file to `supabase/migrations/0001_init.sql`. Move seed data to `supabase/seed.sql`.
- **Acceptance:** No policy returns rows when the caller is not a member of the owning organization.

### Issue 2.5 — `data.ts` uses the browser client — **Critical**
- **Where:** `lib/supabase/data.ts` line 1.
- **Evidence:** `import { createClient } from "@/lib/supabase/client"` — that's `createBrowserClient`. Server components calling these functions execute without cookies.
- **Why it matters:** After RLS lockdown in Phase 4, RSC pages will see empty result sets and writes will fail.
- **Fix:** Split into `lib/supabase/queries.server.ts` (uses `server.ts`) and `lib/supabase/queries.client.ts` (uses `client.ts`). Both export the same function names but bind a different client. Add `import 'server-only'` to the server variant.
- **Acceptance:** RSC pages import only from `queries.server.ts`; client components import only from `queries.client.ts`; build does not bundle server queries to the browser.

### Issue 3 — Server actions are no-ops — **High**
- **Where:** `app/{projects,tasks,profile,tasks/[taskId]}/actions.ts`.
- **Why it matters:** Forms appear functional but persist nothing.
- **Fix:** Fill bodies during Phase 4. Each action: `'use server'` → zod-validate → `createServerSupabaseClient()` → mutate → `revalidatePath()`.
- **Acceptance:** Each dialog persists to Supabase and the page rerenders without manual reload.

### Issue 4 — Pages bypass the data layer — **High**
- **Where:** every `page.tsx` listed in §3.
- **Evidence:** `grep -rn '@/lib/mock-data' app` returns 7 hits; `grep -rn '@/lib/supabase/data' app components` returns 0.
- **Fix:** During Phase 4, swap imports route-by-route. Delete `lib/mock-data.ts` in the same commit that completes the swap.
- **Acceptance:** `git grep mock-data` returns nothing.

### Issue 5 — Middleware does nothing — **High**
- **Where:** `middleware.ts`.
- **Fix:** Replace with a Supabase auth-checking middleware that calls `supabase.auth.getUser()` and redirects unauthenticated users from protected routes (everything except `/login`, `/register`, static assets).
- **Acceptance:** Hitting `/dashboard` while signed out redirects to `/login`; signed-in user can never see `/login`.

### Issue 6 — No `.env.example` — **High**
- **Fix:** Add file with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NVIDIA_API_KEY`, plus comments.

### Issue 7 — README is misleading — **Medium**
- **Where:** `README.md` line 21.
- **Evidence:** mentions Geist, but `app/layout.tsx` imports `Plus_Jakarta_Sans`.
- **Fix:** Rewrite per §20.

### Issue 8 — No error/loading/not-found boundaries — **Medium**
- **Fix:** Add `loading.tsx`, `error.tsx`, `not-found.tsx` at app root. Add per-route variants where data fetching is significant.

### Issue 9 — Seed data inside schema.sql — **Medium**
- **Fix:** Split into `supabase/migrations/0001_init.sql` and `supabase/seed.sql`. The latter runs only via `supabase db reset`.

### Issue 10 — `app/api/setup/` empty stub — **Low**
- **Fix:** Either implement (one-time admin endpoint to seed an org) or remove the directory. Default: remove.

### Issue 11 — `@ai-sdk/openai-compatible` is unused — **Low**
- **Where:** `package.json` line 12; `opencode.json` references it via NVIDIA NIM.
- **Fix:** Either gate behind a feature flag and use it for an "AI summary" microfeature in Phase 6, or remove the dependency to slim the bundle.

### Issue 12 — Working-tree hygiene — **Low**
- **Fix:** Commit or stash the 10 modified files; decide on `opencode.json` (commit if used by the team, gitignore otherwise) before any Phase 1 work.

### Issue 13 — `profiles.id` modeling smell — **Medium**
- **Where:** `schema.sql` lines 50–58.
- **Evidence:** `profiles.id UUID PRIMARY KEY DEFAULT gen_random_uuid()` plus a separate `user_id UUID REFERENCES auth.users(id)`.
- **Fix:** Idiomatic Supabase: `profiles.id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`. Lets RLS write `auth.uid() = profiles.id` directly.
- **Acceptance:** No `user_id` column on `profiles`.

---

## 5. Product Vision

### Existing features (verified)
Static UI for: dashboard, project list, project detail, task list, task detail, comments stub, attachment stub, login, register, profile, documents.

### Proposed core features (Phases 4–6)
- Authentication (email/password + magic link).
- Organizations and organization membership.
- Programs (rolling up multiple projects).
- Projects (CRUD + members).
- Tasks (CRUD + assignment + status + priority + due dates + labels).
- Comments (per-task, threaded).
- Attachments (Supabase Storage, signed URLs, MIME allowlist).
- Activity log (DB-trigger-driven).
- Notifications (in-app + email digest).
- Calendar view (month/week/day).
- Kanban board.
- Reports (project health, team workload, overdue work).
- Role-based access (owner/admin/manager/contributor/viewer).
- Settings (profile, organization, members, billing placeholder).

### Future optional features
- AI task summaries via the existing `@ai-sdk/openai-compatible` + NVIDIA NIM config.
- Mobile app.
- Field reporting with GPS.
- Offline-first PWA.
- Push notifications.
- Budget tracking.
- Approval workflows.
- Payment integration.

---

## 6. Recommended Information Architecture

| Route | Purpose | Min role | Sections | Data | Components | Priority |
|---|---|---|---|---|---|---|
| `/` | Marketing redirect | public | — | none | — | P0 (exists) |
| `/login` | Sign in | public | form, brand panel | session | `Form`, `Input`, `Button` | P0 (refactor for real auth) |
| `/register` | Sign up | public | form, brand panel | session | same | P0 (refactor) |
| `/dashboard` | At-a-glance KPIs | viewer+ | stat cards, recent projects, active tasks | `getDashboardStats`, `getProjects`, `getTasks` | `StatCard`, `DataTable` | P0 |
| `/programs` | Program list | manager+ | grid of `ProgramCard` | `getPrograms` | `ProgramCard`, `FilterBar` | P1 (new) |
| `/programs/[programId]` | Program detail | manager+ | hero, projects under program, milestones | `getProgram`, `getProjectsByProgram` | `Breadcrumbs`, `ProjectCard` | P1 (new) |
| `/projects` | Project list | viewer+ | filters, table | `getProjects` | `DataTable`, `CreateProjectDialog` | P0 |
| `/projects/[projectId]` | Project detail | viewer+ | hero, tasks tab, docs tab, members tab, activity tab | `getProject`, `getTasks`, `getAttachments`, `getActivity` | `Tabs`, `KanbanBoard`, `ActivityTimeline` | P0 |
| `/tasks` | Task list (cross-project) | viewer+ | filters, table or kanban toggle | `getTasks` | `DataTable`, `KanbanBoard` | P0 |
| `/tasks/[taskId]` | Task detail | viewer+ | hero, details, comments, attachments | `getTask`, `getComments`, `getAttachments` | `CommentList`, `AttachmentList` | P0 |
| `/teams` | Members & roles | admin+ | table, invite | `getMembers` | `DataTable`, `InviteDialog` | P1 (new) |
| `/calendar` | Schedule | viewer+ | month/week/day grid | `getTasks` | `CalendarGrid` | P1 (new) |
| `/reports` | Analytics | manager+ | stat cards, charts | `getReportData` | `Recharts` (proposed) | P2 (new) |
| `/settings` | User & org settings | varies | tabbed form | varies | `Tabs`, forms | P1 (new) |
| `/profile` | Self profile | self | form, stats | `getProfile`, `getDashboardStats` | `ProfileForm` | P0 (refactor) |

> The current standalone `/documents` route is folded into `/projects/[projectId]` as a "Documents" tab. Deprecate the standalone page after Phase 5.

---

## 7. UI/UX Upgrade Plan

### App shell
- 72 px collapsible sidebar (existing `components/layout/sidebar.tsx`) — keep mobile drawer behavior, add collapsed state for desktop.
- 64 px sticky topbar (existing `components/layout/topbar.tsx`) — add command palette (`cmdk`), notifications dropdown, user menu with role pill.
- Main column: max-width 1280 px, generous padding, breadcrumbs above page title.

### Page headers
`<PageHeader title actions breadcrumbs subtitle />` — used on every authenticated page. New component.

### Tables
- shadcn `Table` already exists — wrap into a `<DataTable columns rows toolbar />` with sticky header, row selection, sort, pagination, column visibility menu.
- Virtualize when row count > 500 (`@tanstack/react-virtual`).

### Kanban
- New `<KanbanBoard columns tasks onMove />` for `/tasks` and `/projects/[projectId]` task tab.
- `dnd-kit` for drag/drop.

### Calendar
- New `<CalendarGrid view tasks onTaskClick />` for `/calendar`.
- Implement month view first; week/day in Phase 6.

### Forms
- React Hook Form + zod resolvers.
- New `<FormField name label control description error />` wrapper.
- New `<DatePicker />` and `<FileUploader maxSize accept onUpload />`.

### Empty / loading / error
- `<EmptyState icon title body action />`.
- `<LoadingSkeleton variant="table"|"card"|"detail" />`.
- `<ErrorState error reset />` for `error.tsx` files.

### Toasts
- `sonner` (recommended; not yet installed).

### Accessibility
- WCAG 2.1 AA target.
- Keyboard navigation: all interactive elements focusable; focus rings already wired in `globals.css` line 122 (keep).
- ARIA: dialogs, menus, listboxes via Radix primitives (already in place).
- `prefers-reduced-motion`: already handled in `globals.css` line 132 — extend to disable `BackgroundAnimation` canvas.

### Branding decision (blocked by Issue 1)
Once the user picks Option A (light) or Option B (dark), implement palette tokens accordingly. Reserve `#00dc82` for status-success only if Option A wins; reserve `#4f46e5` (indigo-600) for status-info if Option B wins.

### Dzongkha typography
- Latin: Plus Jakarta Sans (already loaded).
- Dzongkha: **Noto Sans Tibetan** (recommended; not yet installed). Apply only to brand mark and Dzongkha headlines.

### Motion
- Page transitions: 150 ms ease-out fade.
- Skeleton shimmer: `tw-animate-css` already installed.

---

## 8. Component Architecture

| Component | Path | Status | Props (sketch) | Used in |
|---|---|---|---|---|
| AppShell | `components/layout/AppShell.tsx` | **create** | `{ children }` | layout.tsx |
| Sidebar | `components/layout/sidebar.tsx` | **refactor** (role-aware nav) | `{ user, collapsed }` | AppShell |
| Topbar | `components/layout/topbar.tsx` | **refactor** (real session) | `{ user }` | AppShell |
| BackgroundAnimation | `components/layout/BackgroundAnimation.tsx` | **keep or delete** (depends on Issue 1) | none | layout.tsx |
| LogoutButton | `components/layout/LogoutButton.tsx` | **refactor** (server action) | none | Sidebar |
| PageHeader | `components/layout/PageHeader.tsx` | **create** | `{ title, subtitle, actions, breadcrumbs }` | every page |
| Breadcrumbs | `components/layout/Breadcrumbs.tsx` | **create** | `{ items }` | PageHeader |
| StatCard | `components/dashboard/StatCard.tsx` | **create** | `{ label, value, icon, delta, href }` | dashboard |
| DataTable | `components/ui/data-table.tsx` | **create** | `{ columns, rows, toolbar, onRowClick }` | projects, tasks, teams |
| FilterBar | `components/ui/filter-bar.tsx` | **create** | `{ filters, value, onChange }` | DataTable |
| SearchInput | `components/ui/search-input.tsx` | **create** | `{ value, onChange, placeholder }` | DataTable, sidebar |
| StatusBadge | `components/ui/status-badge.tsx` | **keep** | `{ status }` | tables, detail pages |
| PriorityBadge | `components/ui/priority-badge.tsx` | **create** | `{ priority }` | tables, detail pages |
| ProgramCard | `components/programs/ProgramCard.tsx` | **create** | `{ program }` | /programs |
| ProjectCard | `components/projects/ProjectCard.tsx` | **create** | `{ project }` | /programs/[id], dashboard |
| ProjectsClient | `components/projects/ProjectsClient.tsx` | **refactor** (use queries.server data passed in) | `{ projects }` | /projects |
| CreateProjectDialog | `components/projects/CreateProjectDialog.tsx` | **refactor** (real action) | `{ onAdd? }` | /projects |
| TaskCard | `components/tasks/TaskCard.tsx` | **create** | `{ task }` | KanbanBoard |
| TasksClient | `components/tasks/TasksClient.tsx` | **refactor** | `{ tasks, projects }` | /tasks |
| CreateTaskDialog | `components/tasks/CreateTaskDialog.tsx` | **refactor** (real action) | `{ projects, onAdd? }` | /tasks, /projects/[id] |
| KanbanBoard | `components/tasks/KanbanBoard.tsx` | **create** | `{ tasks, onMove }` | /tasks, /projects/[id] |
| CalendarGrid | `components/calendar/CalendarGrid.tsx` | **create** | `{ view, tasks, onTaskClick }` | /calendar |
| UserAvatar | `components/ui/user-avatar.tsx` | **create** (wraps shadcn Avatar) | `{ user, size }` | many |
| EmptyState | `components/ui/empty-state.tsx` | **create** | `{ icon, title, body, action }` | many |
| LoadingSkeleton | `components/ui/loading-skeleton.tsx` | **create** | `{ variant }` | loading.tsx |
| ErrorState | `components/ui/error-state.tsx` | **create** | `{ error, reset }` | error.tsx |
| ConfirmDialog | `components/ui/confirm-dialog.tsx` | **create** | `{ open, title, body, onConfirm, onCancel }` | destructive actions |
| FormField | `components/ui/form-field.tsx` | **create** | RHF integration | all forms |
| DatePicker | `components/ui/date-picker.tsx` | **create** | `{ value, onChange }` | task forms |
| FileUploader | `components/ui/file-uploader.tsx` | **create** | `{ maxSize, accept, onUpload }` | AttachmentList |
| CommentThread | `components/comments/CommentList.tsx` | **refactor** (real action, threaded) | `{ taskId, initialComments }` | /tasks/[id] |
| AttachmentList | `components/uploads/AttachmentList.tsx` | **refactor** (real upload) | `{ taskId, initialAttachments }` | /tasks/[id] |
| ActivityTimeline | `components/activity/ActivityTimeline.tsx` | **create** | `{ items }` | /projects/[id] |
| NotificationMenu | `components/layout/NotificationMenu.tsx` | **create** | `{ user }` | Topbar |
| RoleGate | `components/auth/RoleGate.tsx` | **create** | `{ minRole, children }` | many |

---

## 9. Data Model and Supabase Plan

### Current schema (verified, `lib/supabase/schema.sql`)
Five tables: `projects`, `tasks`, `comments`, `attachments`, `profiles`. RLS enabled but every policy is `USING (true)` / `WITH CHECK (true)`. Seed data embedded in the same file.

### Target schema (new tables in **bold**)

```sql
-- Identity
profiles                 -- id PK -> auth.users(id), name, email, avatar_url, role, created_at, updated_at  ← FIX: drop user_id, make id reference auth.users
**organizations**        -- id, name, slug, created_at
**organization_members** -- org_id, user_id, role enum('owner','admin','manager','contributor','viewer'), PRIMARY KEY (org_id,user_id)

-- Hierarchy
**programs**             -- id, org_id FK, title, description, status, start_date, end_date, owner_id FK profiles, audit
**program_members**      -- program_id, user_id, role, PK
projects                 -- id, org_id FK, program_id FK NULL, title, description, status, priority, start_date, end_date, department, manager_id FK profiles, audit
**project_members**      -- project_id, user_id, role, PK
tasks                    -- id, project_id FK, title, description, status, priority, due_date, assignee_id FK profiles, **created_by FK**, audit
**task_comments**        -- (rename of `comments`) id, task_id FK, author_id FK profiles, body text, parent_id FK self NULL (threading), audit
**task_attachments**     -- (rename of `attachments`) id, task_id FK, uploader_id FK profiles, filename, file_type, file_size_bytes int8, storage_path text, audit
**milestones**           -- id, project_id FK, title, due_date, status, audit
**activity_logs**        -- id, org_id FK, actor_id FK profiles, entity_type, entity_id, action, payload jsonb, created_at
**notifications**        -- id, user_id FK, type, body, link, read_at NULL, created_at
**labels**               -- id, org_id FK, name, color
**task_labels**          -- task_id, label_id, PK
```

### Audit fields
Every table except join tables: `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()`, `created_by UUID REFERENCES auth.users(id)`. Trigger to set `updated_at` on UPDATE.

### Indexes (currently missing — all to be added in `0001_init.sql`)
- `tasks(project_id)`, `tasks(status)`, `tasks(assignee_id)`, `tasks(due_date)`.
- `task_comments(task_id, created_at)`.
- `task_attachments(task_id)`.
- `projects(org_id)`, `projects(program_id)`.
- `activity_logs(org_id, created_at DESC)`.
- `notifications(user_id, read_at)`.
- `organization_members(user_id)`.

### RLS strategy
For every tenant-scoped table:
```sql
CREATE POLICY "members_select" ON projects FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM organization_members WHERE user_id = auth.uid()
  ));
```
Similar `INSERT`/`UPDATE`/`DELETE` policies, scoped by role via the `role` column on `organization_members` and per-project `project_members`. **No more `USING (true)`.**

### Storage buckets
- `task-attachments` — private; RLS on path prefix `{org_id}/{project_id}/{task_id}/`.
- `avatars` — public read, RLS on owner write.

### Naming conventions
- Tables: snake_case plural.
- Columns: snake_case.
- FKs: `{referenced_table_singular}_id`.
- Enums: define as Postgres `CREATE TYPE` not strings (Phase 5+).

### Migration strategy
1. Create `supabase/migrations/0001_init.sql` from corrected `schema.sql` content.
2. Move seed data to `supabase/seed.sql`.
3. Use Supabase CLI: `supabase db reset` (local) and `supabase db push` (remote).
4. Each subsequent change is a new numbered migration. Never edit `0001`.

### Seed strategy
- Minimal: 1 demo organization, 3 demo users (owner/manager/viewer), 5 projects, 6 tasks, 3 comments, 2 attachments. Same UUIDs as the current `schema.sql` seed for continuity.

---

## 10. Authentication and Authorization Plan

### Steps
1. Replace `app/login/page.tsx` form submit with a server action `signIn(formData)` that calls `supabase.auth.signInWithPassword()` and `redirect('/dashboard')`.
2. Same for `app/register/page.tsx` → `signUp` action; on success insert a `profiles` row.
3. Add `signOut` server action used by `LogoutButton`.
4. Replace `middleware.ts` with the canonical `@supabase/ssr` middleware (refresh tokens, gate `/dashboard` and below, allow `/login`, `/register`, `/api/auth/*`, static).
5. RSC server components: read `await supabase.auth.getUser()` from the request-scoped server client at the top of every protected page. Redirect to `/login` if null.
6. Client components: `useUser` hook (new) backed by `supabase.auth.onAuthStateChange`.

### Roles and matrix

| Action | owner | admin | manager | contributor | viewer |
|---|---|---|---|---|---|
| Manage org settings | ✅ | — | — | — | — |
| Invite/remove members | ✅ | ✅ | — | — | — |
| Create program/project | ✅ | ✅ | ✅ | — | — |
| Edit any project | ✅ | ✅ | ✅ (own) | — | — |
| Create task | ✅ | ✅ | ✅ | ✅ | — |
| Edit own task | ✅ | ✅ | ✅ | ✅ | — |
| Comment | ✅ | ✅ | ✅ | ✅ | — |
| Read everything | ✅ | ✅ | ✅ | ✅ | ✅ |

UI gating via `<RoleGate minRole="manager">…</RoleGate>`. Server-side gating via RLS — UI gating is convenience only; **never trust the client**.

---

## 11. State Management and Data Fetching Plan

### Defaults
- **RSC by default.** Page-level data via `lib/supabase/queries.server.ts` (uses `lib/supabase/server.ts` + cookies).
- **Client mutations** via server actions (preferred) or `lib/supabase/queries.client.ts` for realtime subscriptions only.
- **`useOptimistic`** (React 19) for snappy comment/task updates.
- **URL state** for filters, search, pagination — `nuqs` (recommended; not yet installed).
- **Component state** only for transient UI (open/closed dialog, hover state).

### Cache strategy
- Next 15 default `fetch` cache; explicit `revalidatePath('/projects')` after mutations.
- Realtime channels (Supabase) for `/tasks/[taskId]` comments.

### File split (Phase 4 acceptance gate)
```
lib/supabase/
  client.ts             # browser singleton (existing)
  server.ts             # request-scoped server client (existing)
  admin.ts              # service-role client + 'server-only' (refactor)
  queries.server.ts     # NEW: RSC-side queries; takes no client arg, builds its own
  queries.client.ts     # NEW: realtime + client-side reads
  schema.ts             # NEW: zod schemas + TS types co-located
```
**Delete `lib/supabase/data.ts` and `lib/mock-data.ts` in the same commit that completes the swap.**

---

## 12. Feature Implementation Roadmap

### Phase 1 — Stabilize the Codebase

**Objectives:** clean repo, design decision, baseline scripts, error/loading boundaries.

**Files to inspect:** every file modified in working tree (10 of them); `package.json`; `eslint.config.mjs`.

**Files to modify/create:**
- `.env.example` (new)
- `.gitignore` (verify `opencode.json` decision)
- `package.json` (add `typecheck`, `format` scripts; add prettier devDeps)
- `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx` (new)
- `app/globals.css` (only after Issue 1 resolved)
- `CLAUDE.md` / `AGENTS.md` (only if Option B wins)

**Steps:**
1. Resolve design conflict via 1 explicit user question.
2. `git status` → commit or stash modified files.
3. Add `.env.example`.
4. Add scripts: `"typecheck": "tsc --noEmit"`, `"format": "prettier --write ."`.
5. Add devDeps: `prettier`, `eslint-plugin-tailwindcss`, `eslint-plugin-jsx-a11y`.
6. `npm install`.
7. `npm run typecheck` → fix errors.
8. `npm run lint` → fix errors.
9. Add `loading.tsx`, `error.tsx`, `not-found.tsx`.
10. `npm run build` → must succeed.

**Acceptance:** `npm run build` clean; `git status --short` empty; design tokens single source of truth.

### Phase 2 — UI Foundation

**Objectives:** lock design tokens, build reusable layout primitives, replace bespoke styling with the system.

**Files:** `app/globals.css`; new components (`AppShell`, `PageHeader`, `Breadcrumbs`, `EmptyState`, `LoadingSkeleton`, `ErrorState`, `StatCard`, `DataTable`, `FilterBar`, `SearchInput`, `UserAvatar`, `ConfirmDialog`, `FormField`, `DatePicker`, `FileUploader`, `RoleGate`).

**Acceptance:** every existing page still renders correctly using the new shell; visual regression checked manually against pre-refactor screenshots.

### Phase 3 — Static Screens Polish

**Objectives:** complete every route in §6 with mock data; introduce Kanban and Calendar prototypes.

**New routes:** `/programs`, `/programs/[programId]`, `/teams`, `/calendar`, `/reports`, `/settings`. Stub content with mock data only.

**Acceptance:** Lighthouse a11y > 90 on every page; no console errors; mobile (375 px) layout reviewed.

### Phase 4 — Supabase Backend

**Objectives:** wire the data path end-to-end; eliminate mock data.

**Files:**
- `supabase/migrations/0001_init.sql` (new — replaces `lib/supabase/schema.sql`)
- `supabase/seed.sql` (new)
- `lib/supabase/queries.server.ts` (new)
- `lib/supabase/queries.client.ts` (new)
- `lib/supabase/schema.ts` (new — zod + TS types)
- `lib/supabase/admin.ts` (refactor — add `import 'server-only'`)
- `middleware.ts` (rewrite — Supabase auth)
- All four `actions.ts` files (fill bodies with `'use server'`, zod validation, mutation, `revalidatePath`)
- Every `page.tsx` (swap `mock-data` import for `queries.server`)
- `lib/mock-data.ts` (**delete**)
- `lib/supabase/data.ts` (**delete after split**)

**Steps:**
1. Apply migration locally with Supabase CLI: `supabase db reset`.
2. Generate types: `supabase gen types typescript --local > lib/supabase/database.types.ts`.
3. Split `data.ts` → `queries.server.ts` + `queries.client.ts`.
4. Rewrite `middleware.ts`.
5. Implement `signIn`, `signUp`, `signOut` server actions.
6. Wire login and register pages.
7. Page by page, swap `mock-data` → `queries.server`. Run `npm run build` after each.
8. Fill in `createProject`, `createTask`, `postComment`, `uploadAttachment`, `updateProfile` actions.
9. `git rm lib/mock-data.ts lib/supabase/data.ts` in a final commit.

**Acceptance:** `git grep mock-data` empty; signed-out users redirected from `/dashboard`; signed-in user sees only their org's data; RLS test (impersonate other user → empty results).

### Phase 5 — Collaboration Features

**Objectives:** comments, attachments, activity, notifications, members, invites, role assignment.

**Storage:** create `task-attachments` bucket with private + path-prefix RLS; `avatars` bucket public-read.

**Activity log:** Postgres triggers on `INSERT`/`UPDATE`/`DELETE` of projects, tasks, comments → write to `activity_logs`.

**Notifications:** simple in-app feed in topbar; email digest deferred.

**Acceptance:** uploading an attachment shows it in the list within 1 s; deleting a project records an activity entry; a comment on a task notifies the assignee.

### Phase 6 — Reporting and Analytics

**Objectives:** dashboards beyond stat cards; export.

**Implementation:**
- SQL views: `vw_project_health`, `vw_team_workload`, `vw_overdue_tasks`.
- Or RPC functions returning aggregates.
- Charts via `recharts` (recommended; not yet installed).
- CSV export via `papaparse`.

**Acceptance:** `/reports` renders 4 widgets backed by views; CSV export of any table.

### Phase 7 — Production Hardening

**Objectives:** validation, tests, security, perf, deploy, docs, monitoring.

**Tasks:**
- zod validation on every server action.
- Vitest unit tests for utilities and pure components.
- Playwright E2E: login, create project, create task, comment, attachment.
- `@axe-core/playwright` smoke run on every page.
- Lighthouse perf budget: LCP < 2.5 s, CLS < 0.1, TTI < 3 s on mid-tier mobile.
- Sentry SDK.
- Vercel Analytics.
- Vercel Firewall rate limit on auth routes.
- Supabase scheduled backups (daily, 7-day retention).
- README + `/docs` per §20.

**Acceptance:** CI runs typecheck, lint, unit, E2E, axe; deploys to Vercel preview on PR; production deploy on `main` merge.

---

## 13. File-by-File Refactoring Plan

| File | Current role | Action | Change | Priority |
|---|---|---|---|---|
| `app/layout.tsx` | Root layout w/ BackgroundAnimation | refactor | Mount AppShell, providers (Theme, Toaster), respect Issue 1 outcome | P1 |
| `app/page.tsx` | Redirect to `/dashboard` | keep | — | — |
| `app/loading.tsx` | — | create | Generic skeleton | P1 |
| `app/error.tsx` | — | create | ErrorState | P1 |
| `app/not-found.tsx` | — | create | EmptyState 404 | P1 |
| `app/globals.css` | Theme tokens | refactor | Per Issue 1 resolution | P1 |
| `app/login/page.tsx` | Static form | refactor | Real auth via server action | P1 |
| `app/register/page.tsx` | Static form | refactor | Real auth + insert profile | P1 |
| `app/dashboard/page.tsx` | Mock stats | refactor | `getDashboardStats` from queries.server | P1 |
| `app/projects/page.tsx` | Client w/ useState | refactor | RSC + server action mutations | P1 |
| `app/projects/[projectId]/page.tsx` | Mock detail | refactor | `getProject`, tabs, members | P1 |
| `app/projects/actions.ts` | No-op | refactor | Real `createProject` action | P1 |
| `app/tasks/page.tsx` | Client w/ useState | refactor | RSC + Kanban toggle | P1 |
| `app/tasks/[taskId]/page.tsx` | Mock detail | refactor | Real comments, attachments | P1 |
| `app/tasks/actions.ts` | No-op | refactor | Real `createTask` | P1 |
| `app/tasks/[taskId]/actions.ts` | No-op | refactor | Real `postComment`, `uploadAttachment` | P1 |
| `app/profile/page.tsx` | Mock user | refactor | Real `getProfile` | P1 |
| `app/profile/actions.ts` | No-op | refactor | Real `updateProfile` | P1 |
| `app/documents/page.tsx` | Standalone static | move | Fold into `/projects/[id]` Documents tab; delete file | P2 |
| `app/api/setup/` | Empty dir | delete | — | P3 |
| `middleware.ts` | Passthrough | rewrite | Supabase `@supabase/ssr` middleware | P1 |
| `components/layout/sidebar.tsx` | Static nav | refactor | Role-aware + collapsed state | P1 |
| `components/layout/topbar.tsx` | Static nav | refactor | Real user, NotificationMenu, command palette | P1 |
| `components/layout/LogoutButton.tsx` | Static | refactor | Server action `signOut` | P1 |
| `components/layout/BackgroundAnimation.tsx` | Canvas particles | keep or delete | Per Issue 1 | P1 |
| `components/projects/ProjectsClient.tsx` | Client list | refactor | Pass real data, use DataTable | P1 |
| `components/projects/CreateProjectDialog.tsx` | Mock add | refactor | Server action + RHF + zod | P1 |
| `components/tasks/TasksClient.tsx` | Client list | refactor | DataTable / Kanban switch | P1 |
| `components/tasks/CreateTaskDialog.tsx` | Mock add | refactor | Server action + RHF + zod | P1 |
| `components/comments/CommentList.tsx` | Local state | refactor | Real comments via action + revalidate | P1 |
| `components/uploads/AttachmentList.tsx` | Local state | refactor | Real upload to Supabase Storage | P1 |
| `components/profile/ProfileForm.tsx` | Mock submit | refactor | Real action + success toast | P1 |
| `components/ui/*` | shadcn primitives | keep | — | — |
| `components/ui/status-badge.tsx` | Custom | keep | Add new statuses if needed | — |
| `lib/utils.ts` | `cn()` | keep | — | — |
| `lib/mock-data.ts` | Mock data | **delete** | After Phase 4 | P1 |
| `lib/supabase/client.ts` | Browser client | keep | — | — |
| `lib/supabase/server.ts` | Server client | keep | — | — |
| `lib/supabase/admin.ts` | Service-role client | refactor | Add `import 'server-only'` at top | P1 |
| `lib/supabase/data.ts` | Browser-bound queries | **split + delete** | Move to `queries.server.ts` + `queries.client.ts` | P1 |
| `lib/supabase/schema.sql` | Schema + seed | **split + move** | Become `supabase/migrations/0001_init.sql` + `supabase/seed.sql`; fix RLS + `profiles.id` | P1 |
| `next.config.js` | Minimal | keep | Add `images.domains` if Supabase Storage public URLs | P2 |
| `tsconfig.json` | Strict | keep | — | — |
| `eslint.config.mjs` | Flat config | refactor | Add tailwindcss + jsx-a11y plugins | P1 |
| `components.json` | shadcn | keep | — | — |
| `opencode.json` | NVIDIA NIM config | keep or delete | Decide whether AI features ship; if not, gitignore | P3 |
| `README.md` | Default scaffold (Geist mention) | rewrite | Per §20 | P1 |
| `package.json` | Deps + 4 scripts | refactor | Add `typecheck`, `format`, `test`, `test:e2e`, prettier devDep | P1 |
| `public/logo.png` | 852 KB | optimize | `next/image` consumers; consider WebP/AVIF export | P2 |

---

## 14. Claude Code Skills, MCP, and Hooks Plan

> **Availability of all skills, MCP servers, and hooks below is "Not confirmed from current codebase"** — recommend, do not assume.

### Recommended skills
- `nextjs-app-router`, `react`, `typescript`, `tailwind-css`, `shadcn-ui`, `supabase`, `postgres`, `auth-security`, `accessibility`, `performance`, `testing`, `deployment-vercel`, `technical-writing`, `codebase-auditor`, `security-reviewer`.

### Recommended MCP servers
- **filesystem** — read project files.
- **git** — branch/diff/log inspection.
- **github** — issue/PR/workflow inspection if a remote is configured.
- **context7** — fetch up-to-date Next.js/Supabase/Tailwind docs.
- **sequential-thinking** — structure multi-step audits.
- **supabase** — local/remote project inspection, migration runs.
- **playwright** — E2E in Phase 7.
- **memory** — retain project context across sessions.

### Recommended Claude Code hooks (`.claude/settings.json`)

```jsonc
{
  "hooks": {
    "PreToolUse": [
      {
        // Block writes to .env.local
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "node .claude/hooks/block-env-local.js" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          // Run typecheck on every TS edit
          { "type": "command", "command": "npx tsc --noEmit" }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "npm run lint -- --quiet" },
          { "type": "command", "command": "git status --short" }
        ]
      }
    ]
  }
}
```

### Recommended Claude Code workflow
1. Read `implementation_plan.md`.
2. Pick **one** phase. Do not skip ahead.
3. Inspect every target file in that phase before editing.
4. Make small commits (one logical change per commit).
5. After each edit: `npx tsc --noEmit` + `npm run lint` + `npm run build` for layout-touching changes.
6. Update the §21 checklist as boxes are completed.
7. End-of-phase: `git diff --stat` summary; mark phase complete; ask the user before opening the PR.

---

## 15. Coding Standards

- **TypeScript:** strict; no `any` outside generated types. Prefer `unknown` + zod parse at boundaries.
- **React:** RSC by default. `"use client"` only for interactivity (forms, drag-drop, charts, optimistic UI).
- **Imports:** `@/` alias. Co-locate component, types, and styles when small.
- **Naming:** files `kebab-case.tsx`; components `PascalCase`; hooks `useCamelCase`.
- **Forms:** RHF + zod resolver; server action receives `FormData` and re-validates with the same zod schema.
- **Supabase:** never import `lib/supabase/admin.ts` outside server-only files; never import `queries.server.ts` from a client component (the `'server-only'` directive will throw at build time).
- **Errors:** server actions return `{ ok: true, data } | { ok: false, error }`; never throw across the action boundary.
- **Loading states:** Suspense + skeletons preferred over spinners.
- **Accessibility:** every interactive element keyboard-reachable; every form input labelled; focus-visible always rendered.
- **Security:** never log secrets; never echo `SUPABASE_SERVICE_ROLE_KEY` even in error messages.
- **Comments:** only when "why" is non-obvious. No headers, no rotting `// added in PR #123` notes.

---

## 16. Testing Plan

### Tooling (devDeps to add)
- `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
- `@playwright/test`, `@axe-core/playwright`.
- `supabase` CLI (already required).

### Test layers
- **Type:** `npm run typecheck` (CI gate).
- **Lint:** `npm run lint` (CI gate, with `eslint-plugin-jsx-a11y`).
- **Unit:** `vitest` — utilities (`cn`, date helpers), zod schemas, pure components.
- **Component:** `@testing-library/react` — Forms, DataTable, Dialogs.
- **Integration:** `vitest` against `supabase start` local containers; test `queries.server.ts` end-to-end with seeded data.
- **E2E:** `playwright` — login, create project, create task, comment, attachment, logout.
- **A11y:** `@axe-core/playwright` smoke on every route.
- **RLS:** `supabase test db` SQL tests; impersonate users via `set_config('request.jwt.claims', …)`.

### Recommended scripts
```jsonc
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write .",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "test:e2e:headed": "playwright test --headed",
  "supabase:reset": "supabase db reset",
  "supabase:types": "supabase gen types typescript --local > lib/supabase/database.types.ts"
}
```

### Manual QA checklist
25 items, grouped by route. Generated as part of Phase 7 documentation.

---

## 17. Deployment Plan

### Environments
- **Local:** `npm run dev` + `supabase start` (Docker).
- **Preview:** Vercel preview per PR + Supabase preview branch (one per PR).
- **Production:** Vercel `main` + Supabase production project.

### Environment variables
| Var | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + local | exposed to client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + local | exposed to client |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel server only + local | **never expose**; used in `admin.ts` |
| `NVIDIA_API_KEY` | Vercel server only + local | optional, only if AI summaries ship |
| `SENTRY_DSN` | Vercel + local | Phase 7 |

### Service-role guardrails
- `lib/supabase/admin.ts` line 1: `import 'server-only'`.
- Lint rule (custom): forbid imports of `admin.ts` from any path matching `app/**/page.tsx` or `components/**`.

### Steps
1. Create Vercel project, link to GitHub repo.
2. Add env vars (preview + production scopes).
3. Configure Vercel build: `npm run build`.
4. Add Vercel Analytics + Speed Insights.
5. Add Vercel Firewall rate limit on `/login`, `/register`, `/api/*`.
6. Custom domain: `layguel360.bt` (or chosen).
7. Supabase project: enable email auth, configure SMTP, set up daily backups.
8. Sentry project + DSN env var.
9. PR template referencing this plan.

---

## 18. Security Plan

### Environment & secrets
- `.env.local` git-ignored (already).
- `.env.example` documents required vars (Phase 1).
- Vercel env scopes: `Production`, `Preview`, `Development` cleanly separated.

### Database
- **Tighten RLS** per §9.
- **Enum types** for `status`, `priority`, `role` to constrain values.
- **`security definer` functions** only when audited.
- **Audit log** via Postgres triggers; immutable (`REVOKE UPDATE`).

### Auth
- Email-link + password.
- Rate-limit `signIn` and `signUp` actions (token bucket via Vercel KV — recommend, not yet installed).
- Lockout after 10 failed sign-ins per 15 min.

### Application
- zod validate every server action input.
- File uploads: MIME allowlist (`pdf`, `xlsx`, `docx`, common images, `csv`, `zip`); 25 MB cap matching `next.config.js` `bodySizeLimit`.
- Storage policies tied to `auth.uid()` + path prefix.
- `Content-Security-Policy` header via `next.config.js` `headers()`.
- `Strict-Transport-Security`, `X-Frame-Options`, `Referrer-Policy`.

### Dependencies
- `npm audit` in CI; fail on high.
- Renovate or Dependabot weekly PRs.

---

## 19. Performance Plan

- **RSC by default** — already partially in place.
- **Code-split** at route boundaries (free with App Router).
- **Dynamic import** for heavy client components (`KanbanBoard`, `CalendarGrid`, `Recharts`).
- **`next/image`** for `public/logo.png` (852 KB) — currently used in `sidebar.tsx` and `login/page.tsx`; verify no bare `<img>` callers remain.
- **Database indexes** per §9.
- **Query limits**: every list query gets `.limit(50)` + cursor pagination by `created_at`.
- **Edge runtime** for read-mostly routes (e.g. `/dashboard`) once auth middleware allows it.
- **Bundle analyzer** wired up: `@next/bundle-analyzer`.
- **LCP target** < 2.5 s on mid-tier 4G mobile. Validate with Lighthouse + Vercel Speed Insights.

---

## 20. Documentation Plan

### Replace `README.md`
Sections: project intro, Dzongkha title meaning, screenshots, stack, prerequisites (Node 20+, Docker for Supabase local), setup steps, env vars, scripts, deployment, contribution. **Remove the Geist mention** — the project uses Plus Jakarta Sans (`app/layout.tsx` line 5).

### `docs/`
- `docs/architecture.md` — system diagram, data flow, RLS overview.
- `docs/supabase.md` — local setup, migrations, seed, type generation.
- `docs/deployment.md` — Vercel + Supabase production walkthrough.
- `docs/contributing.md` — branch naming, commit style, PR template, code of conduct.
- `CHANGELOG.md` — Keep a Changelog format.

### Keep
`CLAUDE.md`, `AGENTS.md`, `concept_note.md`, `product_design.md`, `PROJECT_LOG.md`.

---

## 21. Final Implementation Checklist

### Codebase fixes
- [ ] Resolve design-direction conflict (Issue 1).
- [ ] Tighten RLS in `0001_init.sql` (Issue 2).
- [ ] Split `data.ts` → `queries.server.ts` + `queries.client.ts` (Issue 2.5).
- [ ] Fill in 5 server actions across 4 `actions.ts` files (Issue 3).
- [ ] Swap every page from `mock-data` → `queries.server` (Issue 4).
- [ ] Rewrite `middleware.ts` with Supabase auth (Issue 5).
- [ ] Add `.env.example` (Issue 6).
- [ ] Rewrite `README.md`; remove Geist mention (Issue 7).
- [ ] Add `loading.tsx`, `error.tsx`, `not-found.tsx` (Issue 8).
- [ ] Move seed data to `supabase/seed.sql` (Issue 9).
- [ ] Decide on `app/api/setup/` (delete or implement) (Issue 10).
- [ ] Decide on `@ai-sdk/openai-compatible` + `opencode.json` (use or remove) (Issue 11).
- [ ] Clean working tree (Issue 12).
- [ ] Fix `profiles.id` schema (Issue 13).
- [ ] `import 'server-only'` in `lib/supabase/admin.ts`.
- [ ] Delete `lib/mock-data.ts`.
- [ ] Delete `lib/supabase/data.ts`.

### UI/UX
- [ ] AppShell + PageHeader rolled out to every route.
- [ ] DataTable replaces every bespoke table.
- [ ] Empty/Loading/Error states everywhere.
- [ ] Toaster mounted; success/error toasts on every mutation.
- [ ] Mobile (375 px) layout reviewed on every route.
- [ ] Dzongkha font wired in.
- [ ] Lighthouse a11y > 90.

### Components
- [ ] All ~30 components from §8 created or refactored.

### Pages
- [ ] All routes from §6 implemented.
- [ ] `/documents` standalone removed.

### Backend
- [ ] `0001_init.sql` migration applied.
- [ ] All 16 tables present.
- [ ] All indexes present.
- [ ] Storage buckets created.

### Auth
- [ ] Sign in / sign up / sign out work end-to-end.
- [ ] Middleware redirects correctly.
- [ ] RoleGate gates UI per role.

### Data model
- [ ] zod schemas in `lib/supabase/schema.ts`.
- [ ] DB types regenerated and committed.

### Security
- [ ] Permissive policies removed.
- [ ] `'server-only'` on `admin.ts`.
- [ ] CSP + HSTS headers.
- [ ] `npm audit` clean.

### Testing
- [ ] Vitest unit suite green.
- [ ] Playwright E2E suite green.
- [ ] axe-core a11y suite green.
- [ ] RLS SQL tests green.

### Performance
- [ ] LCP < 2.5 s on `/dashboard`.
- [ ] Bundle analyzer baseline captured.

### Deployment
- [ ] Vercel preview on PR.
- [ ] Production env vars set.
- [ ] Supabase backups scheduled.
- [ ] Sentry receiving events.

### Documentation
- [ ] README rewritten.
- [ ] `docs/` populated.
- [ ] CHANGELOG started.

---

## 22. First 10 Actions

Run these in order before touching any other code.

1. **Resolve Issue 1**: ask the user — light theme per `CLAUDE.md`/`AGENTS.md`, or update the docs to ratify the dark NVIDIA-green theme. Block all UI work until answered.
2. **Clean working tree**: review the 10 modified files and `opencode.json`; commit, stash, or revert. Land on a clean `git status --short` on `main`.
3. **Add `.env.example`** documenting `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NVIDIA_API_KEY`.
4. **Add `typecheck` and `format` scripts** to `package.json`; install `prettier`, `eslint-plugin-tailwindcss`, `eslint-plugin-jsx-a11y` as devDeps.
5. **Run `npx tsc --noEmit` and `npm run lint`**; fix every existing error.
6. **Add `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`**.
7. **Replace `lib/supabase/schema.sql`** with `supabase/migrations/0001_init.sql` + `supabase/seed.sql`. Tighten RLS. Fix `profiles.id` to reference `auth.users(id)` directly. Apply via `supabase db reset`.
8. **Split `lib/supabase/data.ts`** into `lib/supabase/queries.server.ts` (uses `server.ts`) and `lib/supabase/queries.client.ts` (uses `client.ts`). Add `import 'server-only'` to the server file and to `lib/supabase/admin.ts`. Delete `data.ts`.
9. **Replace `middleware.ts`** with the canonical `@supabase/ssr` middleware that gates all non-public routes.
10. **Switch `app/dashboard/page.tsx`** from `lib/mock-data.ts` to `lib/supabase/queries.server.ts` (`getDashboardStats`, `getProjects`, `getTasks`) — this is the proof-of-life that the data path works end-to-end.

After these 10, proceed phase by phase per § 12.
