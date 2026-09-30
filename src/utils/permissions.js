// Central role-based access rules.
// Only "Project Manager" acts as the app's admin role today.
import { isAdmin } from "../services/userService";

export { isAdmin };

// Projects: only admins can create/edit/delete. Everyone can view.
export function canManageProjects(user) {
  return isAdmin(user);
}

// Team: only admins can add/edit/delete members or set passwords.
export function canManageTeam(user) {
  return isAdmin(user);
}

// Email templates: only admins can edit the wording sent on status changes.
export function canManageEmailTemplates(user) {
  return isAdmin(user);
}

// Tasks: admins manage every task; other roles can create tasks and
// edit/delete only tasks assigned to them.
export function canCreateTasks() {
  return true;
}

export function canEditTask(user, task) {
  if (isAdmin(user)) return true;
  return !!task && task.assigneeId === user?.id;
}

export function canDeleteTask(user, task) {
  return canEditTask(user, task);
}

// Visibility scoping: admins see everything; other roles see only what's
// relevant to them (their projects, their tasks, their project teammates).

export function canViewProject(user, project) {
  if (isAdmin(user)) return true;
  return !!project?.teamIds?.includes(user?.id);
}

export function visibleProjects(user, projects) {
  if (isAdmin(user)) return projects;
  return projects.filter((p) => p.teamIds?.includes(user?.id));
}

export function visibleTasks(user, tasks) {
  if (isAdmin(user)) return tasks;
  return tasks.filter((t) => t.assigneeId === user?.id);
}

// Team directory: admins see everyone; other roles see only people who
// share at least one project with them, plus themselves.
export function visibleTeamMembers(user, users, projects) {
  if (isAdmin(user)) return users;
  const sharedProjectIds = projects.filter((p) => p.teamIds?.includes(user?.id));
  const teammateIds = new Set(sharedProjectIds.flatMap((p) => p.teamIds || []));
  teammateIds.add(user?.id);
  return users.filter((u) => teammateIds.has(u.id));
}
