# AGENTS.md

## Project

Project name: ལས་འགུལ་360  
Repository: layguel360  
Type: Full-stack project management web application

Codex should treat this as a serious portfolio-grade SaaS dashboard project.

## Current development stage

Current stage: Version 0 static UI.

Focus only on frontend structure and static mock data for now.

Do not add backend logic, Supabase, authentication, database queries, AI features, mobile app, budget module, approval workflow, payment system, or advanced role-based access unless explicitly requested.

## Technology stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Radix-based components
- lucide-react icons
- Supabase later
- Vercel deployment later

## Version 0 scope

Build only:

- Static dashboard
- Sidebar
- Topbar
- Projects page
- Project detail page
- Tasks page
- Task detail page
- Login page
- Register page
- Profile page
- Comments UI
- Attachments UI
- Responsive web layout
- Static mock data

## Product direction

ལས་འགུལ་360 is a project management platform for planning projects, tracking tasks, managing documents, and monitoring work progress.

The product should feel like a clean, professional project management dashboard suitable for:

- Project managers
- Government staff
- Research teams
- Field-based teams
- Small organizations
- Portfolio demonstration

## Design rules

- Use a modern, NVIDIA-inspired dark SaaS dashboard aesthetic.
- Dark surface (`#0a0a0f` background, `#18181c` cards) with high-contrast foreground (`#e5e5e5`).
- Primary and accent: NVIDIA green `#00dc82`. Reserve for CTAs, focus rings, active states, and key data highlights.
- Glassmorphism: cards, sidebar, and topbar use translucent surfaces with `backdrop-blur` and subtle white-alpha borders.
- Soft rounded corners (radius `0.5rem` base; scale `sm/md/lg/xl/2xl` defined in `app/globals.css`).
- Subtle radial green-glow background gradient with the canvas particle layer (`components/layout/BackgroundAnimation.tsx`). Both must respect `prefers-reduced-motion`.
- Typography: Plus Jakarta Sans (Latin), JetBrains Mono (code). Reserve Noto Sans Tibetan for Dzongkha headings (to be added).
- Status palette: emerald (Active), blue (In Progress), violet (Planning), amber (Pending), purple (Review), slate (Completed), orange (On Hold). Defined in `components/ui/status-badge.tsx`.
- Use shadcn/ui primitives and lucide-react icons throughout.
- Responsive desktop + mobile browser layout.
- Keep the Dzongkha title: ལས་འགུལ་360.
- Do not rename the project.

## Coding rules

- Use TypeScript.
- Use Next.js App Router conventions.
- Use server components by default.
- Use client components only when interactivity is required.
- Use `@/` import alias.
- Keep components small, readable, and reusable.
- Avoid large monolithic page files where reusable components make sense.
- Avoid unnecessary dependencies.
- Do not create fake API keys or fake environment secrets.
- Do not expose secrets.
- Do not modify package versions unless necessary.
- Do not remove existing planning documents.

## Folder conventions

Use this structure where possible:

```text
app/
  login/
  register/
  dashboard/
  projects/
  projects/[projectId]/
  tasks/
  tasks/[taskId]/
  profile/

components/
  layout/
  dashboard/
  projects/
  tasks/
  comments/
  uploads/
  ui/

lib/
types/