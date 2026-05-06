# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

- **Name:** ལས་འགུལ་360 (do not rename — keep the Dzongkha title verbatim in metadata and UI)
- **Repo:** layguel360
- **Type:** Full-stack project management web app (Next.js App Router + Supabase)
- **Audience:** project managers, government staff, research teams, field-based teams, small organizations, portfolio demo

Claude should help as a senior frontend reviewer, product designer, UI refiner, and architecture checker.

## Stage

The static UI scaffolding (Phase 0) is complete and pages are now being **wired to Supabase** page-by-page. Recent commits moved `dashboard`, `projects` list, and `projects/[id]` from `lib/mock-data.ts` to `lib/supabase/queries.server.ts`. `tasks` and detail/profile pages are mid-migration — some still read mock data and some server actions are still no-op stubs. When editing a page, check the file before assuming a data source.

Out of scope until explicitly requested: AI features, mobile app, budget module, approval workflow, payment, GPS field reporting, offline mode, push notifications, advanced org/role hierarchies.

## Commands

Package manager: **npm** (a `package-lock.json` is committed). Scripts in `package.json`:

```bash
npm run dev           # Next dev server on :3000
npm run build         # Production build
npm run start         # Run built app
npm run lint          # ESLint (Next + TS + jsx-a11y)
npm run typecheck     # tsc --noEmit
npm run format        # Prettier write
npm run format:check  # Prettier check (CI-friendly)
```

There is **no test runner configured** — do not invent `npm test`. To verify behavior, run `typecheck` + `lint` + manual browser check against `npm run dev`.

## Environment

Copy `.env.example` → `.env.local`. Required for anything past static rendering:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, used by browser + server clients
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, bypasses RLS; only imported by `lib/supabase/admin.ts` (which has `import "server-only"`). If a build error mentions this leaking to the client, audit `admin.ts` import paths.
- `NVIDIA_API_KEY` — optional, for the future `@ai-sdk/openai-compatible` provider

`middleware.ts` deliberately **no-ops auth gating when Supabase env vars are absent** so a fresh clone runs without 500s; it does not silently allow access in production where the vars must be set.

## Architecture

### Routing & rendering model

- Next.js App Router on `next@^15` + React 19. Match the installed major when reaching for new framework APIs (the AGENTS.md mention of "Next.js 16" is aspirational).
- **Server components by default.** Client components must declare `"use client"` and are only used where interactivity is required (forms, dialogs, particle canvas, tables that filter client-side). Pattern: a server `page.tsx` fetches data via `queries.server.ts` and passes it into a `*Client.tsx` component (see `app/projects/page.tsx` → `components/projects/ProjectsClient.tsx`, same for `tasks`).
- Import alias: `@/` maps to repo root (`tsconfig.json`). Always use `@/components/...`, `@/lib/...`.

### Supabase integration (three clients, do not mix)

- `lib/supabase/server.ts` — request-scoped server client wired to Next's cookie store. Used by RSC pages and server actions. Respects RLS via the user's session.
- `lib/supabase/client.ts` — browser client. Used in client components.
- `lib/supabase/admin.ts` — service-role client, **bypasses RLS**. Server-only (`import "server-only"` enforces this at build). Reserve for trusted server-side mutations that must escape RLS; do not reach for it as a "make the error go away" fix.

Query helpers live in two parallel modules:

- `lib/supabase/queries.server.ts` — typed read helpers (`getProjects`, `getProject`, `getTasks`, `getTask`, `getComments`, `getAttachments`, `getDashboardStats`). Marked `import "server-only"`. Source of truth for the `Project`, `Task`, `Comment`, `Attachment`, `DashboardStats` types — import from here rather than redefining.
- `lib/supabase/queries.client.ts` — counterpart for client components.

If you add a new entity, follow this split: keep SSR pages and server actions on the `.server` module, the browser path on `.client`. Never import `queries.server.ts` (or `admin.ts`) into a client component — `server-only` will throw at build time.

### Auth gating (middleware)

`middleware.ts` is the single chokepoint:

1. Refreshes the Supabase session cookies on every request.
2. Redirects unauthenticated users on protected routes to `/login?next=<original>`.
3. Bounces logged-in users away from `/login` and `/register` to `/dashboard`.

Public path prefixes are defined inline in `PUBLIC_PATHS` (`/login`, `/register`, `/auth`). The matcher already excludes `_next/*` and static image assets, so `middleware` runs only on real navigations. When adding a public route, update `PUBLIC_PATHS` — do **not** weaken the matcher.

### Server actions

Live next to the route under `actions.ts` (`app/projects/actions.ts`, `app/tasks/actions.ts`, `app/tasks/[taskId]/actions.ts`, `app/profile/actions.ts`). Several are still stubs returning `{ ok: true }` — read the file before assuming the action is wired.

Every server action returns the shared `ActionResult<T>` shape from `lib/actions/result.ts`:

- Success: `{ ok: true }` or `{ ok: true, data }`
- Failure: `{ ok: false, error, fieldErrors? }` — `fieldErrors` matches Zod's `flatten().fieldErrors` so forms can render per-field errors. Build new actions on this contract; don't throw across the action boundary.

### Database schema & RLS

`supabase/migrations/0001_init.sql` defines the five core tables: `profiles`, `projects`, `tasks`, `comments`, `attachments`. `profiles.id` references `auth.users.id` directly so RLS policies can do `auth.uid() = profiles.id` without a join.

RLS is **already locked down** — every policy requires an authenticated session, and write/update/delete policies are scoped to creator/author/uploader. The migration deliberately does not ship "wide-open `USING (true)`" policies. Future multi-tenant work (organizations, programs, members) will replace these with org-scoped policies in a follow-up migration. Do not loosen the existing policies as a debugging shortcut.

A `set_updated_at()` trigger keeps `updated_at` fresh on every entity table.

### UI layer

- shadcn/ui components live in `components/ui/`. Shadcn config is in `components.json`; style is `radix-nova`, base color `neutral`, alias root is `@/components`. New primitives go in `components/ui/`.
- Domain components are sliced by feature: `components/{layout,dashboard,projects,tasks,comments,uploads,profile}`. Keep new feature components in the matching folder rather than tossing them into `ui/`.
- `components/ui/status-badge.tsx` is the **single source of truth** for status + priority palettes. When adding a new status value, extend the maps there rather than inlining colors in pages.
- `components/layout/BackgroundAnimation.tsx` is the canvas particle layer mounted from `app/layout.tsx`. It honors `prefers-reduced-motion` — preserve that when editing.

## Design tokens (locked)

Encoded in `app/globals.css` and `components/ui/status-badge.tsx` — do not redefine inline.

- Dark theme: bg `#0a0a0f`, card `#18181c`, fg `#e5e5e5`
- Accent: NVIDIA green `#00dc82` — reserve for CTAs, focus rings, active states, key data highlights
- Glassmorphic surfaces (translucent + `backdrop-blur` + subtle white-alpha border) on cards, sidebar, topbar
- Soft rounded corners (radius scale via CSS variables, base `0.5rem`)
- Status palette: emerald (Active), blue (In Progress), violet (Planning), amber (Pending), purple (Review), slate (Completed), orange (On Hold)
- Priority palette: red (Critical), orange (High), amber (Medium), slate (Low)
- Typography: Plus Jakarta Sans (Latin, loaded via `next/font` in `app/layout.tsx`), JetBrains Mono (code), Noto Sans Tibetan (Dzongkha headings — to be added)
- Responsive desktop + mobile browser layout

## Coding rules

- TypeScript strict; use the `@/` import alias.
- Server components by default; `"use client"` only when interactivity demands it.
- Keep components small and reusable; avoid monolithic page files.
- Don't introduce new dependencies casually, and don't bump package versions unless necessary.
- Don't fabricate API keys or environment values.
- Don't delete planning documents (`concept_note.md`, `implementation_plan.md`, `product_design.md`, `PROJECT_LOG.md`).
- Prefer editing existing files over creating new ones.
