// DEMO DATA ONLY.
// This file seeds localStorage on first run so the dashboard looks
// complete immediately after installation. Replace with real data
// (or a backend API) when extending this project.

export const seedUsers = [
  {
    id: "user_1",
    name: "Albert Rosaryo",
    email: "albertrosaryo65@gmail.com",
    password: "password123",
    role: "Project Manager",
    avatarColor: "#2563eb",
    status: "Active",
  },
  {
    id: "user_2",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    password: "password123",
    role: "Developer",
    avatarColor: "#16a34a",
    status: "Active",
  },
  {
    id: "user_3",
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    password: "password123",
    role: "Developer",
    avatarColor: "#f59e0b",
    status: "Active",
  },
  {
    id: "user_4",
    name: "Sara Khan",
    email: "sara.khan@example.com",
    password: "password123",
    role: "Designer",
    avatarColor: "#7c3aed",
    status: "Away",
  },
  {
    id: "user_5",
    name: "Rohit Verma",
    email: "rohit.verma@example.com",
    password: "password123",
    role: "Tester",
    avatarColor: "#dc2626",
    status: "Active",
  },
  {
    id: "user_6",
    name: "Ananya Iyer",
    email: "ananya.iyer@example.com",
    password: "password123",
    role: "Team Member",
    avatarColor: "#0891b2",
    status: "Offline",
  },
];

export const seedProjects = [
  {
    id: "proj_1",
    name: "Student Management System",
    description:
      "A web application to manage student records, attendance, grades and fee details for a college.",
    status: "In Progress",
    priority: "High",
    startDate: "2026-07-01",
    endDate: "2026-10-25",
    managerId: "user_1",
    teamIds: ["user_1", "user_2", "user_4"],
  },
  {
    id: "proj_2",
    name: "E-Commerce Website",
    description:
      "An online shopping platform with product catalog, cart, checkout and order tracking.",
    status: "In Progress",
    priority: "Urgent",
    startDate: "2026-06-15",
    endDate: "2026-09-30",
    managerId: "user_1",
    teamIds: ["user_2", "user_3", "user_5"],
  },
  {
    id: "proj_3",
    name: "College Event Management",
    description:
      "A system to plan, schedule and manage college events, registrations and notifications.",
    status: "Planning",
    priority: "Medium",
    startDate: "2026-09-01",
    endDate: "2026-12-15",
    managerId: "user_1",
    teamIds: ["user_4", "user_6"],
  },
  {
    id: "proj_4",
    name: "Library Management System",
    description:
      "Manage books, members, issue/return records and fine calculation for a college library.",
    status: "On Hold",
    priority: "Low",
    startDate: "2026-05-01",
    endDate: "2026-08-20",
    managerId: "user_1",
    teamIds: ["user_3", "user_5"],
  },
  {
    id: "proj_5",
    name: "Online Examination System",
    description:
      "A platform to create, conduct and evaluate online exams with auto-grading for MCQs.",
    status: "Completed",
    priority: "High",
    startDate: "2026-02-01",
    endDate: "2026-06-30",
    managerId: "user_1",
    teamIds: ["user_2", "user_4", "user_5", "user_6"],
  },
];

// Helper to build a due date relative to today so demo data always looks current.
function relativeDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
}

export const seedTasks = [
  {
    id: "task_1",
    title: "Design dashboard layout",
    description: "Create wireframes and high-fidelity mockups for the main dashboard screen.",
    projectId: "proj_1",
    assigneeId: "user_4",
    priority: "High",
    status: "Completed",
    dueDate: relativeDate(-10),
    createdDate: relativeDate(-25),
    tags: ["UI", "Design"],
  },
  {
    id: "task_2",
    title: "Create authentication page",
    description: "Implement login and registration pages with client-side validation.",
    projectId: "proj_1",
    assigneeId: "user_2",
    priority: "Urgent",
    status: "In Progress",
    dueDate: relativeDate(2),
    createdDate: relativeDate(-14),
    tags: ["Auth", "Frontend"],
  },
  {
    id: "task_3",
    title: "Implement student records module",
    description: "Build CRUD screens for managing student profiles and academic records.",
    projectId: "proj_1",
    assigneeId: "user_2",
    priority: "High",
    status: "To Do",
    dueDate: relativeDate(7),
    createdDate: relativeDate(-5),
    tags: ["Backend", "CRUD"],
  },
  {
    id: "task_4",
    title: "Test attendance workflow",
    description: "Write and execute test cases for the attendance marking workflow.",
    projectId: "proj_1",
    assigneeId: "user_1",
    priority: "Medium",
    status: "Review",
    dueDate: relativeDate(4),
    createdDate: relativeDate(-8),
    tags: ["Testing"],
  },
  {
    id: "task_5",
    title: "Set up product catalog schema",
    description: "Design the data structure for products, categories and variants.",
    projectId: "proj_2",
    assigneeId: "user_3",
    priority: "High",
    status: "Completed",
    dueDate: relativeDate(-15),
    createdDate: relativeDate(-30),
    tags: ["Database"],
  },
  {
    id: "task_6",
    title: "Build shopping cart component",
    description: "Implement add/remove/update quantity logic for the shopping cart.",
    projectId: "proj_2",
    assigneeId: "user_3",
    priority: "Urgent",
    status: "In Progress",
    dueDate: relativeDate(1),
    createdDate: relativeDate(-12),
    tags: ["Frontend", "Cart"],
  },
  {
    id: "task_7",
    title: "Integrate payment gateway",
    description: "Connect checkout flow with a sandbox payment gateway for demo purposes.",
    projectId: "proj_2",
    assigneeId: "user_2",
    priority: "Urgent",
    status: "To Do",
    dueDate: relativeDate(5),
    createdDate: relativeDate(-3),
    tags: ["Payments"],
  },
  {
    id: "task_8",
    title: "Test checkout workflow",
    description: "Verify order placement, stock updates and confirmation emails.",
    projectId: "proj_2",
    assigneeId: "user_5",
    priority: "High",
    status: "To Do",
    dueDate: relativeDate(9),
    createdDate: relativeDate(-2),
    tags: ["Testing"],
  },
  {
    id: "task_9",
    title: "Plan event registration flow",
    description: "Define the steps and screens required for student event registration.",
    projectId: "proj_3",
    assigneeId: "user_4",
    priority: "Medium",
    status: "To Do",
    dueDate: relativeDate(12),
    createdDate: relativeDate(-1),
    tags: ["Planning"],
  },
  {
    id: "task_10",
    title: "Design event notification templates",
    description: "Create email and in-app notification templates for event reminders.",
    projectId: "proj_3",
    assigneeId: "user_6",
    priority: "Low",
    status: "To Do",
    dueDate: relativeDate(15),
    createdDate: relativeDate(-1),
    tags: ["Design", "Notifications"],
  },
  {
    id: "task_11",
    title: "Fix book issue/return bug",
    description: "Investigate and fix an issue where returned books are not updating stock count.",
    projectId: "proj_4",
    assigneeId: "user_3",
    priority: "High",
    status: "Review",
    dueDate: relativeDate(3),
    createdDate: relativeDate(-6),
    tags: ["Bug"],
  },
  {
    id: "task_12",
    title: "Prepare library fine report",
    description: "Generate a monthly report of pending fines across all members.",
    projectId: "proj_4",
    assigneeId: "user_5",
    priority: "Low",
    status: "To Do",
    dueDate: relativeDate(20),
    createdDate: relativeDate(-1),
    tags: ["Reports"],
  },
  {
    id: "task_13",
    title: "Implement auto-grading for MCQs",
    description: "Build logic to automatically grade multiple-choice question submissions.",
    projectId: "proj_5",
    assigneeId: "user_2",
    priority: "High",
    status: "Completed",
    dueDate: relativeDate(-40),
    createdDate: relativeDate(-60),
    tags: ["Backend"],
  },
  {
    id: "task_14",
    title: "Prepare exam documentation",
    description: "Write user documentation for instructors on creating and publishing exams.",
    projectId: "proj_5",
    assigneeId: "user_6",
    priority: "Medium",
    status: "Completed",
    dueDate: relativeDate(-35),
    createdDate: relativeDate(-55),
    tags: ["Documentation"],
  },
  {
    id: "task_15",
    title: "Design task board UI",
    description: "Create a drag-friendly board layout for visualizing task statuses.",
    projectId: "proj_1",
    assigneeId: "user_4",
    priority: "Medium",
    status: "To Do",
    dueDate: relativeDate(6),
    createdDate: relativeDate(-2),
    tags: ["UI"],
  },
];

export const seedNotifications = [
  {
    id: "notif_1",
    message: "Priya Sharma was assigned a new task: Create authentication page",
    type: "task_assigned",
    read: false,
    createdDate: relativeDate(-1),
  },
  {
    id: "notif_2",
    message: "Task 'Integrate payment gateway' deadline is approaching",
    type: "deadline",
    read: false,
    createdDate: relativeDate(0),
  },
  {
    id: "notif_3",
    message: "Project 'Online Examination System' was marked Completed",
    type: "project_updated",
    read: false,
    createdDate: relativeDate(-3),
  },
  {
    id: "notif_4",
    message: "Rohit Verma completed task 'Set up product catalog schema'",
    type: "task_completed",
    read: true,
    createdDate: relativeDate(-15),
  },
  {
    id: "notif_5",
    message: "Ananya Iyer was added to the team",
    type: "team_added",
    read: true,
    createdDate: relativeDate(-20),
  },
];

export const seedSettings = {
  theme: "light",
  notificationsEnabled: true,
  emailAlerts: false,
};

export const seedEmailTemplates = {
  task_assigned: {
    subject: "You've been assigned: {{taskTitle}}",
    body:
      "Hi {{assigneeName}},\n\n" +
      "You've been assigned a new task in {{projectName}}:\n\n" +
      "  {{taskTitle}}\n" +
      "  Due: {{dueDate}}\n\n" +
      "Log in to Smart Task to view details.",
  },
  task_status_changed: {
    subject: "Task update: {{taskTitle}} is now {{newStatus}}",
    body:
      "Hi {{assigneeName}},\n\n" +
      "The status of your task in {{projectName}} has changed:\n\n" +
      "  {{taskTitle}}\n" +
      "  {{oldStatus}} → {{newStatus}}\n\n" +
      "Log in to Smart Task to view details.",
  },
  project_status_changed: {
    subject: "Project update: {{projectName}} is now {{newStatus}}",
    body:
      "Hi {{managerName}},\n\n" +
      "The status of your project has changed:\n\n" +
      "  {{projectName}}\n" +
      "  {{oldStatus}} → {{newStatus}}\n\n" +
      "Log in to Smart Task to view details.",
  },
};

export const currentUserId = "user_1";
