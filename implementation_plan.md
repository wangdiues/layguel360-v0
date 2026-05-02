# Implementation Plan: ལས་འགུལ་360

## 1. Project title

**ལས་འགུལ་360 — Project Management System**

## 2. Implementation approach

The system will be developed in phases, starting with a minimum working web application. The first implementation will use a free technology stack and will focus on core project and task management features. Advanced modules such as mobile app, AI features, budget tracking, approval workflows, notifications, and field reporting will be added only after the base system is stable.

## 3. Recommended Version 0 stack

```text
Frontend: Next.js + TypeScript
Styling: Tailwind CSS
UI components: shadcn/ui
Backend services: Supabase
Database: Supabase PostgreSQL
Authentication: Supabase Auth
Storage: Supabase Storage
Version control: GitHub
Deployment: Vercel
```

## 4. Version 0 implementation scope

Version 0 will include:

- User registration
- User login
- Protected dashboard
- Project creation
- Project listing
- Project detail page
- Project editing
- Project deletion
- Task creation
- Task listing
- Task detail page
- Task status update
- Task comments
- File upload
- Profile page
- Responsive web layout

Version 0 will not include:

- Dedicated mobile app
- AI features
- Payment system
- Organization management
- Advanced roles and permissions
- Gantt chart
- Budget module
- Approval workflow
- Field reporting
- Offline mode
- Push notifications

## 5. Development phases

## Phase 0: Project setup

### Objective

Create the basic development environment, repository, and project structure.

### Tasks

1. Create GitHub repository named `lasergul-360`.
2. Create a new Next.js project with TypeScript.
3. Install Tailwind CSS.
4. Install and configure shadcn/ui.
5. Create base folder structure.
6. Create initial README.md.
7. Push initial code to GitHub.

### Expected output

A clean Next.js project connected to GitHub.

## Phase 1: Static user interface

### Objective

Build the main user interface without database connection.

### Pages to create

```text
/login
/register
/dashboard
/projects
/projects/[projectId]
/tasks/[taskId]
/profile
```

### Components to create

```text
Sidebar
Topbar
DashboardCard
ProjectCard
ProjectTable
TaskTable
TaskStatusBadge
PriorityBadge
ProjectForm
TaskForm
CommentBox
FileUploadBox
```

### Expected output

A clickable static prototype of the web application.

## Phase 2: Supabase setup

### Objective

Set up backend services using Supabase.

### Tasks

1. Create a Supabase project.
2. Get project URL and anon key.
3. Add environment variables to `.env.local`.
4. Create Supabase client in the app.
5. Enable email authentication.
6. Create database tables.
7. Create storage bucket for attachments.
8. Set Row Level Security policies.

### Environment variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Expected output

Supabase is connected to the Next.js application.

## Phase 3: Database design

### Objective

Create the minimum database schema required for Version 0.

### Tables

```text
profiles
projects
tasks
comments
attachments
```

## Table: profiles

Fields:

```text
id uuid primary key
full_name text
email text
avatar_url text
created_at timestamp
updated_at timestamp
```

## Table: projects

Fields:

```text
id uuid primary key
user_id uuid foreign key references profiles(id)
title text
description text
status text
priority text
start_date date
end_date date
created_at timestamp
updated_at timestamp
```

## Table: tasks

Fields:

```text
id uuid primary key
project_id uuid foreign key references projects(id)
user_id uuid foreign key references profiles(id)
title text
description text
status text
priority text
due_date date
created_at timestamp
updated_at timestamp
```

## Table: comments

Fields:

```text
id uuid primary key
task_id uuid foreign key references tasks(id)
user_id uuid foreign key references profiles(id)
comment text
created_at timestamp
```

## Table: attachments

Fields:

```text
id uuid primary key
task_id uuid foreign key references tasks(id)
user_id uuid foreign key references profiles(id)
file_name text
file_url text
file_type text
created_at timestamp
```

### Expected output

A working database schema for projects, tasks, comments, and files.

## Phase 4: Authentication

### Objective

Implement user registration, login, logout, and protected routes.

### Tasks

1. Build register form.
2. Build login form.
3. Connect forms to Supabase Auth.
4. Add logout function.
5. Protect dashboard and project pages.
6. Redirect unauthenticated users to login page.
7. Create profile record after registration.

### Expected output

Users can register, log in, log out, and access protected pages.

## Phase 5: Project CRUD

### Objective

Allow users to create, view, edit, and delete projects.

### Tasks

1. Create project form.
2. Insert project into Supabase.
3. Fetch user projects.
4. Display projects in table or cards.
5. Create project detail page.
6. Add edit project function.
7. Add delete project function.
8. Add project status and priority badges.

### Expected output

Users can fully manage their own projects.

## Phase 6: Task CRUD

### Objective

Allow users to create and manage tasks under projects.

### Tasks

1. Create task form.
2. Insert task into Supabase.
3. Fetch tasks by project.
4. Display tasks under project detail page.
5. Create task detail page.
6. Update task status.
7. Update task priority.
8. Edit task details.
9. Delete task.

### Expected output

Users can create and manage project tasks.

## Phase 7: Comments

### Objective

Allow users to add comments to tasks.

### Tasks

1. Create comment form under task detail page.
2. Save comments to Supabase.
3. Fetch comments by task.
4. Display comments in chronological order.
5. Show comment author and date.

### Expected output

Users can discuss or document task progress through comments.

## Phase 8: File uploads

### Objective

Allow users to upload task-related documents.

### Tasks

1. Create Supabase Storage bucket named `attachments`.
2. Create file upload component.
3. Upload files to Supabase Storage.
4. Save file metadata in `attachments` table.
5. Display uploaded files under task detail page.
6. Add file delete option.

### Supported file types

```text
PDF
DOCX
XLSX
PNG
JPG
JPEG
```

### Expected output

Users can upload and view files attached to tasks.

## Phase 9: Dashboard logic

### Objective

Make the dashboard show real project and task statistics.

### Dashboard metrics

```text
Total projects
Active projects
Completed projects
Pending tasks
Overdue tasks
Completed tasks
```

### Tasks

1. Fetch projects and tasks from Supabase.
2. Count total projects.
3. Count active projects.
4. Count completed projects.
5. Count pending tasks.
6. Count overdue tasks based on due date.
7. Count completed tasks.
8. Display recent projects and recent tasks.

### Expected output

Dashboard reflects real user data.

## Phase 10: Responsive design and polish

### Objective

Improve usability and visual quality.

### Tasks

1. Make layout responsive for mobile browser.
2. Improve sidebar for small screens.
3. Add empty states.
4. Add loading states.
5. Add confirmation dialogs for delete actions.
6. Add form validation.
7. Add toast notifications.
8. Check accessibility basics.

### Expected output

A clean, usable, and mobile-responsive Version 0 app.

## Phase 11: Deployment

### Objective

Deploy the application online.

### Tasks

1. Push final code to GitHub.
2. Connect GitHub repository to Vercel.
3. Add Supabase environment variables in Vercel.
4. Deploy the project.
5. Test deployed web app.
6. Fix deployment errors if any.
7. Add deployed link to README.md.

### Expected output

A live web application hosted on Vercel.

## 6. Suggested folder structure

```text
lasergul-360/
├── app/
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── projects/
│   │   └── [projectId]/
│   ├── tasks/
│   │   └── [taskId]/
│   └── profile/
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── projects/
│   ├── tasks/
│   ├── comments/
│   └── uploads/
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── types/
├── public/
├── product_design.md
├── implementation_plan.md
├── README.md
└── package.json
```

## 7. Build order checklist

```text
[ ] Create GitHub repository
[ ] Create Next.js project
[ ] Install Tailwind CSS
[ ] Install shadcn/ui
[ ] Build layout
[ ] Build static pages
[ ] Create Supabase project
[ ] Add environment variables
[ ] Create database tables
[ ] Add Supabase Auth
[ ] Build register page
[ ] Build login page
[ ] Protect dashboard routes
[ ] Build project CRUD
[ ] Build task CRUD
[ ] Build comments
[ ] Build file uploads
[ ] Build dashboard metrics
[ ] Improve responsive design
[ ] Add loading and empty states
[ ] Deploy to Vercel
[ ] Update README.md
```

## 8. Future implementation phases

After Version 0 is complete, future development can continue in the following order:

### Version 1

- Team members
- Basic role-based access
- Search and filters
- Task Kanban board
- Calendar view

### Version 2

- Budget tracking
- Approval workflow
- Document templates
- Notifications
- Export to PDF

### Version 3

- Mobile app using Expo React Native
- Field report form
- GPS capture
- Photo evidence
- Offline draft mode

### Version 4

- AI project summary
- AI report generator
- AI task extraction
- AI risk detection

## 9. Minimum success criteria

The implementation will be considered successful when:

- Users can register and log in.
- Users can create and manage projects.
- Users can create and manage tasks under projects.
- Users can update task status.
- Users can add comments to tasks.
- Users can upload task files.
- Dashboard shows real project and task counts.
- App works on desktop and mobile browser.
- App is deployed online through Vercel.

## 10. Final implementation statement

The first implementation of **ལས་འགུལ་360** will be a free, responsive, full-stack web application built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase, GitHub, and Vercel. The system will start with essential project and task management features and will be expanded later into a more advanced platform for team collaboration, field reporting, budget monitoring, and AI-assisted project management.

