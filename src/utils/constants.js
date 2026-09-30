// Centralized constants used across the application.
// Keeping these in one place makes it easy to change labels/colors app-wide.

export const TASK_STATUS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  COMPLETED: "Completed",
};

export const TASK_STATUS_LIST = Object.values(TASK_STATUS);

export const TASK_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const TASK_PRIORITY_LIST = Object.values(TASK_PRIORITY);

export const PROJECT_STATUS = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
};

export const PROJECT_STATUS_LIST = Object.values(PROJECT_STATUS);

export const PROJECT_PRIORITY_LIST = ["Low", "Medium", "High", "Urgent"];

export const TEAM_ROLES = [
  "Project Manager",
  "Developer",
  "Designer",
  "Tester",
  "Team Member",
];

// Badge color classes keyed by value. Used by <Badge /> to stay consistent.
export const STATUS_COLORS = {
  [TASK_STATUS.TODO]: "badge-gray",
  [TASK_STATUS.IN_PROGRESS]: "badge-blue",
  [TASK_STATUS.REVIEW]: "badge-purple",
  [TASK_STATUS.COMPLETED]: "badge-green",
  [PROJECT_STATUS.PLANNING]: "badge-gray",
  [PROJECT_STATUS.ON_HOLD]: "badge-orange",
};

export const PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: "badge-green",
  [TASK_PRIORITY.MEDIUM]: "badge-blue",
  [TASK_PRIORITY.HIGH]: "badge-orange",
  [TASK_PRIORITY.URGENT]: "badge-red",
};

export const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

// localStorage keys used by services/storageService.js
export const STORAGE_KEYS = {
  PROJECTS: "std_projects",
  TASKS: "std_tasks",
  USERS: "std_users",
  NOTIFICATIONS: "std_notifications",
  SETTINGS: "std_settings",
  CURRENT_USER: "std_current_user",
  EMAIL_TEMPLATES: "std_email_templates",
  EMAIL_LOG: "std_email_log",
  SEEDED: "std_seeded_v5",
};

// Email template keys and the placeholders each one supports.
// Placeholders are substituted when a real send is simulated.
export const EMAIL_TEMPLATE_KEYS = {
  TASK_ASSIGNED: "task_assigned",
  TASK_STATUS_CHANGED: "task_status_changed",
  PROJECT_STATUS_CHANGED: "project_status_changed",
};

export const EMAIL_TEMPLATE_META = {
  [EMAIL_TEMPLATE_KEYS.TASK_ASSIGNED]: {
    label: "Task Assigned",
    description: "Sent to a team member when a task is assigned to them.",
    placeholders: ["{{assigneeName}}", "{{taskTitle}}", "{{projectName}}", "{{dueDate}}"],
  },
  [EMAIL_TEMPLATE_KEYS.TASK_STATUS_CHANGED]: {
    label: "Task Status Changed",
    description: "Sent to the assignee whenever a task's status changes.",
    placeholders: ["{{assigneeName}}", "{{taskTitle}}", "{{projectName}}", "{{oldStatus}}", "{{newStatus}}"],
  },
  [EMAIL_TEMPLATE_KEYS.PROJECT_STATUS_CHANGED]: {
    label: "Project Status Changed",
    description: "Sent to the project manager whenever a project's status changes.",
    placeholders: ["{{managerName}}", "{{projectName}}", "{{oldStatus}}", "{{newStatus}}"],
  },
};

// Sample values used to render a live preview in the template editor —
// purely illustrative, never sent anywhere.
export const EMAIL_TEMPLATE_SAMPLE_VALUES = {
  [EMAIL_TEMPLATE_KEYS.TASK_ASSIGNED]: {
    assigneeName: "Priya Sharma",
    taskTitle: "Design login page",
    projectName: "E-Commerce Website",
    dueDate: "Oct 15, 2026",
  },
  [EMAIL_TEMPLATE_KEYS.TASK_STATUS_CHANGED]: {
    assigneeName: "Priya Sharma",
    taskTitle: "Design login page",
    projectName: "E-Commerce Website",
    oldStatus: "In Progress",
    newStatus: "Review",
  },
  [EMAIL_TEMPLATE_KEYS.PROJECT_STATUS_CHANGED]: {
    managerName: "Alex Johnson",
    projectName: "E-Commerce Website",
    oldStatus: "In Progress",
    newStatus: "Completed",
  },
};
