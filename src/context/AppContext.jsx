// Central application data context.
// Holds projects, tasks, users and notifications in memory (backed by
// localStorage through the service layer) so any component can read
// and mutate them without prop-drilling.
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { seedDatabaseIfNeeded } from "../services/seedService";
import * as projectService from "../services/projectService";
import * as taskService from "../services/taskService";
import * as userService from "../services/userService";
import * as notificationService from "../services/notificationService";
import * as emailTemplateService from "../services/emailTemplateService";
import * as emailLogService from "../services/emailLogService";
import { canManageProjects, canManageTeam, canManageEmailTemplates, canEditTask, canDeleteTask } from "../utils/permissions";
import { EMAIL_TEMPLATE_KEYS } from "../utils/constants";

const AppContext = createContext(null);

// The "From" address on a simulated email is the project's manager's chosen
// sender email (set on their Profile), falling back to their account email.
function resolveSenderEmail(manager) {
  return manager?.senderEmail || manager?.email || "notifications@smarttask.demo";
}

export function AppProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailTemplates, setEmailTemplates] = useState({});
  const [emailLog, setEmailLog] = useState([]);

  const refreshAll = useCallback(() => {
    setProjects(projectService.getAllProjects());
    setTasks(taskService.getAllTasks());
    setUsers(userService.getAllUsers());
    setNotifications(notificationService.getAllNotifications());
    setCurrentUser(userService.getCurrentUser());
    setEmailTemplates(emailTemplateService.getAllTemplates());
    setEmailLog(emailLogService.getAllEmails());
  }, []);

  useEffect(() => {
    seedDatabaseIfNeeded();
    refreshAll();
    setIsLoading(false);
  }, [refreshAll]);

  // ---- Project actions ----
  const addProject = (data) => {
    if (!canManageProjects(currentUser)) return;
    projectService.createProject(data);
    refreshAll();
  };
  const editProject = (id, updates) => {
    if (!canManageProjects(currentUser)) return;
    const before = projectService.getProjectById(id);
    projectService.updateProject(id, updates);
    if (updates.status && updates.status !== before?.status) {
      const manager = userService.getUserById(before?.managerId);
      if (manager?.email) {
        const email = emailTemplateService.renderTemplate(EMAIL_TEMPLATE_KEYS.PROJECT_STATUS_CHANGED, {
          managerName: manager.name,
          projectName: before?.name || "",
          oldStatus: before?.status || "",
          newStatus: updates.status,
        });
        if (email) {
          emailLogService.logEmail({
            to: manager.email,
            from: resolveSenderEmail(manager),
            ...email,
            templateKey: EMAIL_TEMPLATE_KEYS.PROJECT_STATUS_CHANGED,
          });
        }
      }
      notificationService.createNotification(
        `Project '${before?.name}' status changed to ${updates.status}`,
        "project_updated"
      );
    }
    refreshAll();
  };
  const removeProject = (id) => {
    if (!canManageProjects(currentUser)) return;
    projectService.deleteProject(id);
    taskService.getAllTasks()
      .filter((t) => t.projectId === id)
      .forEach((t) => taskService.deleteTask(t.id));
    refreshAll();
  };
  const addProjectFeedback = (id, { rating, comment }) => {
    projectService.updateProject(id, {
      feedback: {
        rating,
        comment,
        byUserId: currentUser?.id || null,
        date: new Date().toISOString().split("T")[0],
      },
    });
    refreshAll();
  };

  // ---- Task actions ----
  const addTask = (data) => {
    const task = taskService.createTask(data);
    if (data.assigneeId) {
      const assignee = userService.getUserById(data.assigneeId);
      notificationService.createNotification(
        `${assignee?.name || "A team member"} was assigned a new task: ${task.title}`,
        "task_assigned"
      );
      if (assignee?.email) {
        const project = projectService.getProjectById(task.projectId);
        const manager = userService.getUserById(project?.managerId);
        const email = emailTemplateService.renderTemplate(EMAIL_TEMPLATE_KEYS.TASK_ASSIGNED, {
          assigneeName: assignee.name,
          taskTitle: task.title,
          projectName: project?.name || "",
          dueDate: task.dueDate || "No due date",
        });
        if (email) {
          emailLogService.logEmail({
            to: assignee.email,
            from: resolveSenderEmail(manager),
            ...email,
            templateKey: EMAIL_TEMPLATE_KEYS.TASK_ASSIGNED,
          });
        }
      }
    }
    refreshAll();
  };
  const editTask = (id, updates) => {
    const task = taskService.getTaskById(id);
    if (!canEditTask(currentUser, task)) return;
    taskService.updateTask(id, updates);
    if (updates.status && updates.status !== task?.status) {
      if (updates.status === "Completed") {
        notificationService.createNotification(
          `Task '${task?.title}' was marked as completed`,
          "task_completed"
        );
      }
      const assignee = userService.getUserById(task?.assigneeId);
      if (assignee?.email) {
        const project = projectService.getProjectById(task?.projectId);
        const manager = userService.getUserById(project?.managerId);
        const email = emailTemplateService.renderTemplate(EMAIL_TEMPLATE_KEYS.TASK_STATUS_CHANGED, {
          assigneeName: assignee.name,
          taskTitle: task?.title || "",
          projectName: project?.name || "",
          oldStatus: task?.status || "",
          newStatus: updates.status,
        });
        if (email) {
          emailLogService.logEmail({
            to: assignee.email,
            from: resolveSenderEmail(manager),
            ...email,
            templateKey: EMAIL_TEMPLATE_KEYS.TASK_STATUS_CHANGED,
          });
        }
      }
    }
    refreshAll();
  };
  const removeTask = (id) => {
    const task = taskService.getTaskById(id);
    if (!canDeleteTask(currentUser, task)) return;
    taskService.deleteTask(id);
    refreshAll();
  };
  const addTaskFeedback = (id, { rating, comment }) => {
    taskService.updateTask(id, {
      feedback: {
        rating,
        comment,
        byUserId: currentUser?.id || null,
        date: new Date().toISOString().split("T")[0],
      },
    });
    refreshAll();
  };

  // ---- Auth actions ----
  const login = (email, password) => {
    const user = userService.loginUser(email, password);
    if (user) refreshAll();
    return user;
  };
  const logout = () => {
    userService.logoutUser();
    setCurrentUser(null);
  };

  // ---- User actions ----
  const addUser = (data) => {
    if (!canManageTeam(currentUser)) return null;
    const newUser = userService.createUser(data);
    notificationService.createNotification(`${data.name} was added to the team`, "team_added");
    refreshAll();
    return newUser;
  };
  const editUser = (id, updates) => {
    // Any signed-in user may update their own profile (e.g. name/email on the
    // Profile page); only admins may edit other members or set passwords.
    const isSelf = currentUser?.id === id;
    if (!isSelf && !canManageTeam(currentUser)) return null;
    if (!canManageTeam(currentUser) && "password" in updates) return null;
    const updated = userService.updateUser(id, updates);
    refreshAll();
    return updated;
  };
  const removeUser = (id) => {
    if (!canManageTeam(currentUser)) return;
    userService.deleteUser(id);
    refreshAll();
  };

  // ---- Email template actions ----
  const updateEmailTemplate = (key, updates) => {
    if (!canManageEmailTemplates(currentUser)) return;
    emailTemplateService.updateTemplate(key, updates);
    refreshAll();
  };
  const resetEmailTemplate = (key) => {
    if (!canManageEmailTemplates(currentUser)) return;
    emailTemplateService.resetTemplate(key);
    refreshAll();
  };

  // ---- Notification actions ----
  const markNotificationRead = (id) => {
    notificationService.markAsRead(id);
    refreshAll();
  };
  const markAllNotificationsRead = () => {
    notificationService.markAllAsRead();
    refreshAll();
  };

  const value = {
    projects,
    tasks,
    users,
    notifications,
    currentUser,
    isLoading,
    login,
    logout,
    addProject,
    editProject,
    removeProject,
    addTask,
    editTask,
    removeTask,
    addTaskFeedback,
    addProjectFeedback,
    addUser,
    editUser,
    removeUser,
    emailTemplates,
    emailLog,
    updateEmailTemplate,
    resetEmailTemplate,
    markNotificationRead,
    markAllNotificationsRead,
    refreshAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
