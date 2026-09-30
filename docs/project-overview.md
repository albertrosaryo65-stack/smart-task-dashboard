# Project Overview

## What is this project?

Smart Task is a **Task and Project Management Dashboard** built using React.js. It helps a user organize their work into **Projects**, break each project down into **Tasks**, assign those tasks to **team members**, and track progress through a dashboard and reports.

Think of it like a simplified version of tools such as Trello, Asana, or Jira — built from scratch to learn how such applications work internally.

## Why was it built this way?

This is an academic (BCA Final Year) project, so the priorities were:

1. **Clarity over cleverness** — the code should be easy to read and explain in a viva.
2. **No backend required** — the app uses `localStorage` so it can be installed and demonstrated on any machine without setting up a server or database.
3. **Realistic structure** — even though there's no backend, the code is organized as if there were one (a separate `services/` layer), so it's easy to plug in a real API later.

## How data flows through the app

```
User clicks a button (e.g. "Create Task")
        │
        ▼
A page component (e.g. Tasks.jsx) calls a function from AppContext
(e.g. addTask(taskData))
        │
        ▼
AppContext calls the matching service function
(e.g. taskService.createTask(taskData))
        │
        ▼
The service function reads/writes localStorage
through storageService.js
        │
        ▼
AppContext re-reads all data and updates React state
        │
        ▼
Every component using useApp() automatically re-renders
with the new data
```

This one-way data flow (UI → Context → Service → Storage → back to UI) is a simplified version of the same pattern used in many real-world React applications that talk to a backend API instead of `localStorage`.

## Key concepts demonstrated

- **Component-based architecture** — the UI is built from small, reusable pieces (Badge, Modal, ProgressBar, Avatar, etc.) instead of one giant file.
- **Context API for state management** — `AppContext` holds all app data (projects, tasks, users, notifications) so any component can read or update it without passing props through many layers.
- **Service layer pattern** — UI components never talk to `localStorage` directly; they always go through `services/`.
- **Client-side routing** — React Router switches between pages (Dashboard, Projects, Tasks, etc.) without reloading the browser.
