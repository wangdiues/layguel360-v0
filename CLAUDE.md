@AGENTS.md



\# CLAUDE.md



\## Project



Project name: ལས་འགུལ་360  

Repository: layguel360  

Type: Full-stack project management web application



Claude should help as a senior frontend reviewer, product designer, UI refiner, and architecture checker.



\## Current development stage



Current stage: Version 0 static UI.



Focus only on frontend structure, clean design, page layout, reusable components, and static mock data.



Do not add Supabase, authentication, database queries, AI features, mobile app, payment system, budget module, approval workflow, GPS field reporting, or advanced roles unless explicitly requested.



\## Technology stack



\- Next.js 16 App Router

\- TypeScript

\- Tailwind CSS v4

\- shadcn/ui

\- Radix-based components

\- lucide-react icons

\- Supabase later

\- Vercel later



\## Product direction



ལས་འགུལ་360 is a project management system for planning projects, tracking tasks, managing documents, and monitoring work progress.



The product should feel like a clean, modern SaaS dashboard suitable for:



\- Project managers

\- Government staff

\- Research teams

\- Field-based teams

\- Small organizations

\- Portfolio demonstration



\## Version 0 scope



Version 0 should include:



\- Dashboard

\- Sidebar

\- Topbar

\- Projects page

\- Project detail page

\- Tasks page

\- Task detail page

\- Login page

\- Register page

\- Profile page

\- Comments UI

\- Attachments UI

\- Static mock data

\- Responsive web layout



\## Excluded from Version 0



Do not implement yet:



\- Supabase Auth

\- Database tables

\- Storage logic

\- Mobile app

\- AI features

\- Budget tracking

\- Approval workflow

\- Field reporting

\- GPS capture

\- Offline mode

\- Push notifications

\- Payment system

\- Complex organization roles



\## Design direction



Use a modern NVIDIA-inspired dark SaaS dashboard aesthetic.



Locked design tokens (see `app/globals.css`):



\- Dark theme — background `#0a0a0f`, foreground `#e5e5e5`

\- Glassmorphic cards with translucent surfaces and `backdrop-blur`

\- Primary / accent: NVIDIA green `#00dc82` — used for CTAs, focus rings, and key highlights

\- Sidebar and topbar are translucent and float above the canvas particle background

\- Soft rounded corners (radius scale defined via CSS variables)

\- Status palette via `components/ui/status-badge.tsx`

\- Typography: Plus Jakarta Sans (Latin), JetBrains Mono (code), Noto Sans Tibetan (Dzongkha headings, to be added)

\- Canvas particle background (`components/layout/BackgroundAnimation.tsx`) with `prefers-reduced-motion` honored

\- Responsive desktop and mobile browser layout



Keep the app title as:



```text

ལས་འགུལ་360

