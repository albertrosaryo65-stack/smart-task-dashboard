// Small, reusable helper functions shared across pages/components.

export function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function isOverdue(dueDate, status) {
  if (!dueDate || status === "Completed") return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export function daysUntil(dateString) {
  if (!dateString) return null;
  const today = new Date(new Date().toDateString());
  const target = new Date(dateString);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function calculateProjectProgress(project, tasks) {
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  if (projectTasks.length === 0) return 0;
  const completed = projectTasks.filter((t) => t.status === "Completed").length;
  return Math.round((completed / projectTasks.length) * 100);
}

export function truncate(text = "", maxLength = 100) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function classNames(...args) {
  return args.filter(Boolean).join(" ");
}

export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }
  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }
  if (hour >= 17 && hour < 21) {
    return "Good evening";
  }
  return "Good night";
}
