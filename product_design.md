# Product Design: ལས་འགུལ་360

## 1. Product name

**ལས་འགུལ་360**  
**English subtitle:** Project Management System

## 2. Product vision

**ལས་འགུལ་360** is a simple, responsive, and scalable project management platform that helps users plan projects, manage tasks, track deadlines, upload documents, and monitor progress from one central dashboard.

The first version will focus on a clean web-based product that works well on both desktop and mobile browsers. It will later be expanded into a dedicated mobile application with advanced features such as field reporting, budget tracking, approval workflows, notifications, and AI-assisted report generation.

## 3. Product purpose

The purpose of the system is to reduce scattered project management across Excel files, emails, messaging apps, paper notes, and separate folders. The platform will provide one organized place for users to manage projects, tasks, comments, files, and progress status.

## 4. Target users

Version 0 will focus on the following users:

- Individual users managing personal or professional projects
- Small project teams
- Project managers
- Government staff
- Research teams
- Field-based professionals
- Students or developers managing portfolio projects

Future versions may support forestry, conservation, public administration, donor-funded projects, field monitoring, and research programme management.

## 5. Core problem

Many project teams lack a simple system for tracking project progress, task ownership, deadlines, supporting documents, and status updates. Information is often scattered across different tools, making it difficult to know what is planned, what is pending, what is delayed, and what has been completed.

## 6. Product goal

To build a free, practical, and portfolio-grade full-stack project management application that supports essential project planning, task tracking, documentation, and progress monitoring.

## 7. Version 0 scope

Version 0 will include only the minimum features required for a working project management system.

### Included features

- User registration
- User login
- User logout
- Dashboard
- Project creation
- Project listing
- Project detail view
- Project editing
- Project deletion
- Task creation
- Task listing
- Task detail view
- Task status update
- Task priority setting
- Task due date setting
- Task comments
- File uploads
- Basic user profile
- Responsive web design

### Excluded features for Version 0

- Dedicated mobile app
- AI features
- Payment system
- Advanced organization roles
- Gantt chart
- Calendar view
- Budget tracking
- Approval workflow
- Field reporting
- GPS tracking
- Offline mode
- Push notifications

## 8. Main user journey

```text
Register account
→ Login
→ View dashboard
→ Create project
→ Add project details
→ Create tasks under the project
→ Update task status
→ Add task comments
→ Upload task documents
→ Monitor progress on dashboard
```

## 9. Information architecture

### Main navigation

- Dashboard
- Projects
- Tasks
- Documents
- Profile
- Logout

### Main pages

```text
/login
/register
/dashboard
/projects
/projects/[projectId]
/tasks/[taskId]
/profile
```

## 10. Core modules

### 10.1 Authentication module

Allows users to create an account, log in, log out, and access protected pages.

Main functions:

- Register user
- Login user
- Logout user
- View profile

### 10.2 Dashboard module

Provides a summary of project and task status.

Dashboard cards:

- Total projects
- Active projects
- Completed projects
- Pending tasks
- Overdue tasks
- Completed tasks

Dashboard sections:

- Recent projects
- Recent tasks
- Task status summary

### 10.3 Project module

Allows users to create and manage projects.

Project fields:

- Project title
- Description
- Start date
- End date
- Status
- Priority
- Created date
- Updated date

Project status values:

- Planning
- Active
- On hold
- Completed
- Cancelled

Project priority values:

- Low
- Medium
- High
- Critical

### 10.4 Task module

Allows users to create, update, and track tasks within projects.

Task fields:

- Task title
- Task description
- Project ID
- Status
- Priority
- Due date
- Assigned user
- Created date
- Updated date

Task status values:

- To do
- In progress
- Review
- Done

Task priority values:

- Low
- Medium
- High
- Critical

### 10.5 Comment module

Allows users to add task-level comments for discussion and progress updates.

Comment fields:

- Task ID
- User ID
- Comment text
- Created date

### 10.6 Attachment module

Allows users to upload and view task-related files.

Attachment fields:

- Task ID
- File name
- File URL
- File type
- Uploaded by
- Uploaded date

Supported files:

- PDF
- DOCX
- XLSX
- PNG
- JPG
- JPEG

## 11. Dashboard design concept

The dashboard should use a clean, professional layout with a sidebar, top bar, summary cards, tables, and status badges.

### Dashboard layout

```text
------------------------------------------------
Top Bar: ལས་འགུལ་360 | Search | Profile
------------------------------------------------
Sidebar:
- Dashboard
- Projects
- Tasks
- Documents
- Profile
------------------------------------------------
Main Area:

[Total Projects] [Active Projects] [Pending Tasks] [Completed Tasks]

Recent Projects
------------------------------------------------
Project Name        Status        Due Date
Forest Survey       Active        30 Jun 2026
Carbon Mapping      Planning      15 Jul 2026

Recent Tasks
------------------------------------------------
Task Name           Status        Priority
Prepare report      In Progress   High
Upload shapefile    To Do         Medium
```

## 12. Visual design direction

### Design style

- Clean dashboard interface
- Light background
- White cards
- Soft shadows
- Rounded corners
- Clear typography
- Sidebar navigation
- Status badges
- Responsive layout

### Suggested color palette

```text
Primary: Indigo or blue
Background: #F8FAFC
Card background: #FFFFFF
Text: #111827
Muted text: #6B7280
Success: Green
Warning: Amber
Danger: Red
```

## 13. Minimum database concept

Minimum tables:

```text
profiles
projects
tasks
comments
attachments
```

Relationship:

```text
One user has many projects
One project has many tasks
One task has many comments
One task has many attachments
```

Simple relationship diagram:

```text
profiles
   |
   |--- projects
             |
             |--- tasks
                       |
                       |--- comments
                       |--- attachments
```

## 14. Future product expansion

Future versions may include:

- Mobile app using Expo React Native
- Budget and expenditure tracking
- Approval workflows
- Role-based access control
- Calendar view
- Gantt chart
- Project map view
- Field reporting forms
- GPS and photo evidence capture
- Notifications
- AI project summaries
- AI report generation
- AI task extraction from documents

## 15. Product success criteria

Version 0 will be successful if users can:

- Register and log in
- Create projects
- Add and manage tasks
- Update task status
- Add comments
- Upload task documents
- View progress from a dashboard
- Use the app comfortably on desktop and mobile browser

## 16. Final product statement

**ལས་འགུལ་360** is a responsive full-stack project management web application designed to help users organize projects, manage tasks, track deadlines, upload documents, and monitor work progress through a centralized dashboard.

