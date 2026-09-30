# Data / "Database" Design

This project does not use a real database — it uses the browser's `localStorage` as a simple JSON document store. This document describes the shape of that data so it's easy to understand (and easy to map to real database tables later, e.g. in MySQL or MongoDB).

## Storage keys

Each entity type is stored under its own `localStorage` key (see `src/utils/constants.js` → `STORAGE_KEYS`):

| Key                  | Holds                          |
|----------------------|----------------------------------|
| `std_projects`         | Array of Project objects            |
| `std_tasks`             | Array of Task objects                |
| `std_users`              | Array of User (team member) objects   |
| `std_notifications`       | Array of Notification objects           |
| `std_settings`              | A single Settings object                   |
| `std_current_user`           | The ID of the currently "logged in" user     |

## Entity shapes

### Project

```js
{
  id: "proj_1",
  name: "Student Management System",
  description: "...",
  status: "In Progress",        // Planning | In Progress | On Hold | Completed
  priority: "High",              // Low | Medium | High | Urgent
  startDate: "2026-07-01",        // ISO date string
  endDate: "2026-10-25",           // ISO date string
  managerId: "user_1",              // References a User.id
  teamIds: ["user_1", "user_2"],     // Array of User.id
}
```

### Task

```js
{
  id: "task_1",
  title: "Design dashboard layout",
  description: "...",
  projectId: "proj_1",           // References a Project.id
  assigneeId: "user_4",           // References a User.id (optional)
  priority: "High",                // Low | Medium | High | Urgent
  status: "Completed",              // To Do | In Progress | Review | Completed
  dueDate: "2026-09-12",              // ISO date string
  createdDate: "2026-08-28",           // ISO date string
  tags: ["UI", "Design"],
}
```

### User (Team Member)

```js
{
  id: "user_1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  password: "password123",  // mock auth only, not securely hashed
  role: "Project Manager",  // Project Manager | Developer | Designer | Tester | Team Member
  avatarColor: "#2563eb",
  status: "Active",          // Active | Away | Offline
}
```

### Notification

```js
{
  id: "notif_1",
  message: "Priya Sharma was assigned a new task: ...",
  type: "task_assigned",   // task_assigned | deadline | project_updated | task_completed | team_added
  read: false,
  createdDate: "2026-09-21",
}
```

### Settings

```js
{
  theme: "light",
  notificationsEnabled: true,
  emailAlerts: false,
}
```

## Relationships

- A **Project** has many **Tasks** (`Task.projectId → Project.id`).
- A **Project** has one manager and many team members (`Project.managerId` and `Project.teamIds` → `User.id`).
- A **Task** has one optional assignee (`Task.assigneeId → User.id`).

These relationships are stored by ID reference, similar to foreign keys in a relational database. If this project were migrated to MySQL, you'd create four tables (`projects`, `tasks`, `users`, `notifications`) plus a join table for `project_team_members` (since a project can have many team members and a user can be on many projects).

## Why localStorage instead of a real database?

For a Final Year BCA project, the goal is to demonstrate frontend skills without requiring the student to set up and host a backend server. All data access is isolated inside `src/services/`, so replacing `localStorage` with real API calls later only requires rewriting the functions in that folder — no changes to any page or component.
