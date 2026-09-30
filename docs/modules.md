# Application Modules

This document explains each page/module of the application, what it does, and which files implement it.

## 1. Dashboard (`/`)

**File:** `src/pages/Dashboard.jsx`

The landing page after opening the app. Shows:
- A personalized greeting using the logged-in demo user's name.
- Four summary stat cards: Total Projects, Active Projects, Pending Tasks, Completed Tasks.
- Cards for the top 3 active projects.
- A list of the 5 nearest upcoming task deadlines.

## 2. Projects (`/projects`)

**File:** `src/pages/Projects.jsx`

Lists all projects as cards with search, status filter, and sorting. Supports:
- **Create** a project (`ProjectFormModal` → `ProjectForm`)
- **Edit** a project (same form, pre-filled)
- **Delete** a project (with confirmation — also deletes its tasks)
- **View** a project (navigates to Project Details)

## 3. Project Details (`/projects/:id`)

**File:** `src/pages/ProjectDetails.jsx`

Shows one project in depth using four tabs:
- **Overview** — description, progress bar, start/due dates, manager, recent activity.
- **Tasks** — only this project's tasks, with the same search/filter/sort tools as the main Tasks page, plus "Add Task".
- **Team** — team members assigned to this project and their task completion counts.
- **Activity** — a simple timeline of task creation/completion for this project.

## 4. My Tasks (`/tasks`)

**File:** `src/pages/Tasks.jsx`

The central place to manage all tasks across every project. Supports:
- **Create / Edit / Delete** tasks (with confirmation on delete)
- **View** task details in a read-only modal
- **Search** by title
- **Filter** by status, priority, and project
- **Sort** by due date, priority, or title
- Responsive layout: a table on desktop, cards on mobile (below 700px width)

## 5. Calendar (`/calendar`)

**File:** `src/pages/Calendar.jsx`

Shows task due dates and project deadlines on a calendar. Supports:
- **Month view** — full month grid
- **Week view** — 7-day columns
- **Day view** — list of events for a single day
- Clicking an event opens a modal with its details

## 6. Team (`/team`)

**File:** `src/pages/Team.jsx`

Lists all team members as cards. Supports:
- **Create / Edit / Delete** team members
- **Search** by name and **filter** by role
- Clicking a member opens a modal showing their assigned tasks

## 7. Reports (`/reports`)

**File:** `src/pages/Reports.jsx`

Analytics page built with the Recharts library. Includes:
- Summary stat cards (projects/tasks totals)
- Pie chart: Task Status Distribution
- Pie chart: Task Priority Distribution
- Bar chart: Project Progress (% complete per project)
- Line chart: Tasks Completed Over Time

## 8. Notifications

**File:** `src/components/layout/Header.jsx` (dropdown) + `src/services/notificationService.js`

A bell icon in the header shows an unread-count badge. Clicking it opens a dropdown listing recent notifications (task assigned, task completed, project updated, team member added). Notifications are generated automatically by `AppContext` when certain actions happen (e.g. creating a task with an assignee).

## 9. Profile (`/profile`)

**File:** `src/pages/Profile.jsx`

Lets the logged-in demo user update their name/email and view a summary of their own assigned/completed tasks.

## 10. Settings (`/settings`)

**File:** `src/pages/Settings.jsx`

Simple toggles for in-app notifications and (demo) email alerts, persisted via `settingsService.js`.
