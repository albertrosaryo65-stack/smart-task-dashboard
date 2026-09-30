# Smart Task and Project Management Dashboard

## Project Overview

Smart Task is a web-based **Task and Project Management Dashboard** built with React.js. It allows a user to create and manage projects, break work down into tasks, assign tasks to team members, track deadlines, and view progress through a visual dashboard and reports.

This project was built as a **Final Year BCA Computer Science project** to demonstrate practical, hands-on knowledge of frontend web development using React — including component-based architecture, routing, state management, CRUD operations, form validation, data visualization, and responsive UI design.

The application runs entirely in the browser. It does not require a backend server or database — all data is stored locally using the browser's `localStorage`, so it can be installed and demonstrated on any computer with Node.js installed.

## Objectives

- Build a fully working, browser-based dashboard using React.js.
- Demonstrate complete CRUD (Create, Read, Update, Delete) functionality for Projects, Tasks, and Team Members.
- Practice component-based architecture and reusable UI components.
- Implement client-side routing with multiple pages.
- Implement search, filtering, and sorting across the application.
- Visualize project and task data using charts.
- Persist application data locally using `localStorage`.
- Build a responsive UI that works on desktop, tablet, and mobile screens.

## Features

- **Authentication** — email/password login screen (mock auth, no backend) with per-user sessions; unauthenticated visits redirect to `/login`.
- **Role-Based Access Control** — the "Project Manager" role acts as an admin:
  - Only Project Managers can create/edit/delete projects, add/edit/delete team members, set or reset a team member's password, and edit email templates.
  - Other roles (Developer, Designer, Tester, Team Member) can create tasks and edit/delete only tasks assigned to them; everything else is view-only.
  - Data itself is scoped by role: non-admins only see projects they're a member of, only their own assigned tasks, and only teammates who share a project with them. Project Managers see everything.
- **Dashboard** — summary statistics, active projects overview, and upcoming deadlines (scoped to the signed-in user's role).
- **Projects** — create, view, edit, delete, search, filter, and sort projects (admin-only mutations).
- **Project Details** — tabbed view (Overview, Tasks, Team, Activity, Feedback) for a single project; direct-URL access is blocked for users who aren't on the project.
- **Task Management** — create, view, edit, delete tasks with status, priority, due dates, and tags.
- **Task Table** — searchable table with multi-select Status/Priority/Project filters (select several values per filter) and sorting; responsive card layout on mobile.
- **Calendar** — Month/Week/Day views showing task and project deadlines.
- **Team** — view and manage team members, their roles, and assigned tasks.
- **Feedback & Ratings** — star rating + comment feedback on completed tasks and on projects.
- **Email Templates & Simulated Sending** — Project Managers can edit the subject/body of three email templates (task assigned, task status changed, project status changed) from an accordion editor with a live preview. A task or project status change renders the matching template and logs it to an in-app **Email Log** (searchable/filterable data table) as the "From"/"To"/subject/body — no real email is sent, since this app has no backend or SMTP integration.
- **Per-Manager Sender Email** — each Project Manager can set a "Sender Email" on their Profile page; it's used as the "From" address on every simulated email generated for their projects.
- **Reports** — charts for task status distribution, task priority distribution, project progress, and tasks completed over time.
- **Notifications** — in-app notification panel with unread count badge.
- **Global Search** — search across projects, tasks, and team members from the header.
- **Profile & Settings** — update personal profile info, manage notification preferences, and (for Project Managers) edit email templates and view the email log, organized into tabs.
- **Form Validation** — required fields and date validation with clear error messages.
- **Confirmation Dialogs** — confirmation required before deleting projects, tasks, or team members.
- **Empty & Loading States** — friendly empty states and loading indicators throughout the app.
- **Data Persistence** — all data is saved to `localStorage` and survives page refresh.

## Technology Stack

- **React** — UI library (function components + hooks)
- **Vite** — build tool and development server
- **JavaScript (ES6+)**
- **HTML5 / CSS3** — custom design system (no CSS framework)
- **React Router** — client-side routing
- **Recharts** — charts for the Reports page
- **Lucide React** — icon library
- **localStorage** — client-side data persistence

## System Requirements

- **Node.js** v18 or higher (v20+ recommended)
- **npm** v9 or higher
- A modern web browser (Chrome, Edge, Firefox)

## Installation

1. **Open a terminal and navigate into the project folder.** This is the folder that contains `package.json` (the same folder this `README.md` is in) — `npm install` will fail with an `ENOENT: no such file or directory, open '.../package.json'` error if you run it from anywhere else, such as your home directory.

   ```bash
   cd path/to/smart-task-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the URL shown in the terminal (usually `http://localhost:5173`) in your web browser.

5. You'll land on the **login page**. Sign in with the demo Project Manager account shown on that page:

   ```
   Email:    alex.johnson@example.com
   Password: password123
   ```

   See [Sample Login / Demo Users](#sample-login--demo-users) below for the other seeded accounts and their roles.

On first run, the app automatically seeds itself with demo data (projects, tasks, team members, and email templates) so the dashboard is ready to explore immediately. This seeding is versioned (see `STORAGE_KEYS.SEEDED` in `src/utils/constants.js`) — if you pull an update that changes the demo data shape, the app will reseed automatically on next load, no need to manually clear your browser's storage.

### Other commands

```bash
npm run build     # Create a production build in the dist/ folder
npm run preview   # Preview the production build locally
npm run lint      # Run oxlint
```

## Project Structure

```
src/
├── assets/            Static assets
├── components/
│   ├── layout/         Sidebar, Header, Layout shell, global search
│   ├── common/          Reusable UI: Modal, Badge, Avatar, ProgressBar,
│   │                      MultiSelectDropdown, PasswordInput,
│   │                      FeedbackForm/Summary, StarRating, etc.
│   ├── dashboard/       Dashboard-specific components (StatCard)
│   ├── projects/        Project cards, forms, tabs
│   ├── tasks/            Task table, forms, filters, modals
│   ├── team/              Team member cards, forms, modals
│   └── settings/          Email template editor, Email Log table
│
├── pages/               One file per route (Login, Dashboard, Projects, ...)
├── data/                 Demo/seed data (seedData.js), incl. default email templates
├── services/             CRUD + business-logic layer that talks to localStorage
├── hooks/                Custom hooks (useDebounce, useClickOutside)
├── utils/                Constants, permissions/RBAC rules, and helper functions
├── context/              React Context providers (app data + UI state)
├── routes/               Route definitions + the RequireAuth guard
├── App.jsx                Root component (providers + router)
├── main.jsx                Application entry point
└── index.css               Global design system / styles
```

## Application Modules

- **Login** — `src/pages/Login.jsx`, `src/routes/RequireAuth.jsx`: email/password sign-in; unauthenticated routes redirect here.
- **Dashboard** — `src/pages/Dashboard.jsx`: summary cards, active projects, upcoming deadlines, scoped by role.
- **Projects** — `src/pages/Projects.jsx`, `src/pages/ProjectDetails.jsx`: full project CRUD (admin-only) and detail view with an access guard for non-members.
- **Tasks** — `src/pages/Tasks.jsx`: full task CRUD with search, multi-select filters, and sort.
- **Calendar** — `src/pages/Calendar.jsx`: Month/Week/Day calendar of deadlines.
- **Team** — `src/pages/Team.jsx`: team member CRUD (admin-only), password reset, and task summaries.
- **Reports** — `src/pages/Reports.jsx`: analytics charts built with Recharts.
- **Notifications** — integrated into `src/components/layout/Header.jsx`.
- **Profile** — `src/pages/Profile.jsx`: update the current user's info; Project Managers can also set their sender email.
- **Settings** — `src/pages/Settings.jsx`: tabbed Preferences / Email Templates (admin-only) / Email Log.

## Roles & Permissions

All access rules live in one file, `src/utils/permissions.js`, so the whole app's RBAC logic can be audited in one place:

- `isAdmin(user)` — true only for the "Project Manager" role.
- `canManageProjects` / `canManageTeam` / `canManageEmailTemplates` — admin-only mutation gates.
- `canEditTask` / `canDeleteTask` — admins can touch any task; other roles only their own assigned tasks.
- `canViewProject`, `visibleProjects`, `visibleTasks`, `visibleTeamMembers` — data-scoping helpers that filter what non-admins see (their projects, their tasks, their project teammates) versus admins, who see everything.

These functions are called both in the UI (to hide buttons/menus a role can't use) and inside `AppContext.jsx`'s mutating functions themselves, so the restriction holds even if a component tried to bypass the UI.

## CRUD Operations

CRUD and business logic is centralized in the `src/services/` folder so UI components never talk to `localStorage` directly:

- `projectService.js` — create, read, update, delete Projects
- `taskService.js` — create, read, update, delete Tasks
- `userService.js` — create, read, update, delete Team Members; login/logout
- `notificationService.js` — create, read, and mark notifications as read
- `emailTemplateService.js` — read/update/reset email templates; renders `{{placeholder}}` tokens
- `emailLogService.js` — records simulated outbound emails (no real network call)

These services are consumed through `AppContext` (`src/context/AppContext.jsx`), which exposes simple functions like `addTask`, `editTask`, and `removeTask` to any component in the app, applying the permission checks from `src/utils/permissions.js` before each mutation. This keeps components focused on UI while the context/service layer handles data logic and access control — making the code easy to follow and easy to extend.

## Data Storage

This project uses the browser's `localStorage` as its data store, wrapped by a small generic helper (`src/services/storageService.js`) that handles JSON serialization safely.

On first launch, `src/services/seedService.js` copies the demo data from `src/data/seedData.js` into `localStorage` under these keys (see `STORAGE_KEYS` in `src/utils/constants.js`):

| Key                   | Stores                                |
|-----------------------|----------------------------------------|
| `std_projects`        | All projects                           |
| `std_tasks`           | All tasks                              |
| `std_users`           | Team members (incl. password, role, sender email) |
| `std_notifications`   | Notifications                          |
| `std_settings`        | App preferences                        |
| `std_current_user`    | Signed-in user's ID (or none if logged out) |
| `std_email_templates` | Editable email template subject/body   |
| `std_email_log`       | Simulated outbound emails               |

Because all data access goes through the service layer, this app can later be switched to a real backend API (e.g. Node.js + Express + MongoDB/MySQL) by rewriting only the functions inside `src/services/`, with no changes needed in the UI components.

## Sample Login / Demo Users

This demo version uses mock authentication backed by `localStorage` — there is no real backend, so passwords are stored in plain text in the seed data purely for demonstration. Sign in with any seeded user's email and the shared demo password `password123`:

| Email                          | Role            |
|---------------------------------|-----------------|
| `alex.johnson@example.com`      | Project Manager (admin) |
| `priya.sharma@example.com`      | Developer       |
| `arjun.mehta@example.com`       | Developer       |
| `sara.khan@example.com`         | Designer        |
| `rohit.verma@example.com`       | Tester          |
| `ananya.iyer@example.com`       | Team Member     |

Only the Project Manager account can create/edit/delete projects and team members, reset other members' passwords, and edit email templates. See [Roles & Permissions](#roles--permissions) above.

## Screenshots

Add screenshots of the running application here for your project report/demonstration, for example:

```
docs/screenshots/dashboard.png
docs/screenshots/projects.png
docs/screenshots/tasks.png
docs/screenshots/reports.png
```

## Future Enhancements

- Node.js + Express.js backend API
- MySQL or MongoDB database instead of localStorage
- Real authentication with hashed passwords and JWT/session tokens (current login is mock, plaintext-password auth for demo purposes only)
- A real transactional email service (e.g. SMTP, SendGrid, EmailJS) so template-based emails actually deliver, instead of only being recorded in the in-app Email Log
- Real-time collaboration (WebSockets)
- Cloud deployment (Vercel, Netlify, or a cloud VM)
- File attachments on tasks

> Note: role-based access control and email notifications (listed as future work in earlier drafts of this README) are already implemented — see [Roles & Permissions](#roles--permissions) and the Email Templates/Email Log features above.

## Learning Outcomes

Building this project helps demonstrate the following skills:

- React component development with function components and hooks
- Client-side routing with React Router, including protected/authenticated routes
- Application state management using the Context API
- Implementing full CRUD operations
- Designing and enforcing role-based access control (RBAC) both in the UI and in the data layer
- Building and validating forms
- Designing a responsive UI without a CSS framework
- Working with charting libraries to visualize data
- Structuring a data/service layer that is independent of the UI
- Organizing a medium-sized React project into a clean folder structure

## Academic Use

This project is designed as a **Final Year BCA academic project** for demonstration and learning purposes. It is intentionally kept simple and easy to explain during a project viva, while still being a complete, working application. It can be extended with a real backend as described in "Future Enhancements" above.

## License

This project is provided for academic and educational use. You are free to use, modify, and extend it for learning purposes.
