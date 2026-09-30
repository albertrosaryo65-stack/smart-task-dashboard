import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderKanban, Activity, Clock, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/dashboard/StatCard";
import StatDrillDownModal from "../components/dashboard/StatDrillDownModal";
import TaskDetailModal from "../components/tasks/TaskDetailModal";
import ProjectCard from "../components/projects/ProjectCard";
import EmptyState from "../components/common/EmptyState";
import Loading from "../components/common/Loading";
import { daysUntil, formatDate, isOverdue, getTimeGreeting } from "../utils/helpers";
import { canManageProjects, visibleProjects, visibleTasks } from "../utils/permissions";

export default function Dashboard() {
  const { projects: allProjects, tasks: allTasks, currentUser, isLoading } = useApp();
  const navigate = useNavigate();
  // Which stat card is drilled into ("total" | "active" | "pending" | "completed" | null).
  const [drillKey, setDrillKey] = useState(null);
  // Task opened from the drill-down; the drill-down is hidden (not reset) while it is open.
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  if (isLoading) return <Loading />;

  const canManage = canManageProjects(currentUser);
  const projects = visibleProjects(currentUser, allProjects);
  const tasks = visibleTasks(currentUser, allTasks);

  const activeProjects = projects.filter((p) => p.status === "In Progress");
  const pendingTasks = tasks.filter((t) => t.status !== "Completed");
  const completedTasks = tasks.filter((t) => t.status === "Completed");
  const highPriorityPending = pendingTasks.filter(
    (t) => t.priority === "High" || t.priority === "Urgent"
  );
  const dueThisWeek = activeProjects.filter((p) => {
    const days = daysUntil(p.endDate);
    return days !== null && days >= 0 && days <= 7;
  });

  const upcomingTasks = [...pendingTasks]
    .filter((t) => t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const byDueDate = (field) => (a, b) =>
    new Date(a[field] || "9999-12-31") - new Date(b[field] || "9999-12-31");
  const isHighPriority = (item) => item.priority === "High" || item.priority === "Urgent";
  const isDueThisWeek = (date) => {
    const days = daysUntil(date);
    return days !== null && days >= 0 && days <= 7;
  };

  const drillDowns = {
    total: {
      title: "All Projects",
      subtitle: `${projects.length} projects · ${activeProjects.length} in progress`,
      type: "projects",
      items: [...projects].sort(byDueDate("endDate")),
      filters: [
        { key: "all", label: "All", test: () => true },
        { key: "in-progress", label: "In Progress", test: (p) => p.status === "In Progress" },
        { key: "planning", label: "Planning", test: (p) => p.status === "Planning" },
        { key: "on-hold", label: "On Hold", test: (p) => p.status === "On Hold" },
        { key: "completed", label: "Completed", test: (p) => p.status === "Completed" },
      ],
    },
    active: {
      title: "Active Projects",
      subtitle: `${activeProjects.length} in progress · ${dueThisWeek.length} due this week`,
      type: "projects",
      items: [...activeProjects].sort(byDueDate("endDate")),
      filters: [
        { key: "all", label: "All active", test: () => true },
        { key: "due-week", label: "Due this week", test: (p) => isDueThisWeek(p.endDate) },
        { key: "overdue", label: "Overdue", test: (p) => isOverdue(p.endDate, p.status) },
        { key: "high", label: "High / Urgent", test: isHighPriority },
      ],
    },
    pending: {
      title: "Pending Tasks",
      subtitle: `${pendingTasks.length} open tasks · ${highPriorityPending.length} high priority`,
      type: "tasks",
      items: [...pendingTasks].sort(byDueDate("dueDate")),
      filters: [
        { key: "all", label: "All pending", test: () => true },
        { key: "high", label: "High / Urgent", test: isHighPriority },
        { key: "overdue", label: "Overdue", test: (t) => isOverdue(t.dueDate, t.status) },
        { key: "due-week", label: "Due this week", test: (t) => isDueThisWeek(t.dueDate) },
        { key: "todo", label: "To Do", test: (t) => t.status === "To Do" },
        { key: "in-progress", label: "In Progress", test: (t) => t.status === "In Progress" },
        { key: "review", label: "Review", test: (t) => t.status === "Review" },
      ],
    },
    completed: {
      title: "Completed Tasks",
      subtitle: `${completedTasks.length} tasks completed across all projects`,
      type: "tasks",
      items: [...completedTasks].sort(byDueDate("dueDate")).reverse(),
      filters: [
        { key: "all", label: "All completed", test: () => true },
        ...projects
          .filter((p) => completedTasks.some((t) => t.projectId === p.id))
          .map((p) => ({ key: p.id, label: p.name, test: (t) => t.projectId === p.id })),
      ],
    },
  };
  const activeDrill = drillKey ? drillDowns[drillKey] : null;
  // Look the task up live so edits (e.g. feedback) show immediately in the detail modal.
  const selectedTask = allTasks.find((t) => t.id === selectedTaskId) || null;

  const firstName = currentUser?.name?.split(" ")[0] || "there";
  const greeting = getTimeGreeting();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting}, {firstName} 👋</h1>
          <p className="page-subtitle">Here's what's happening with your projects today.</p>
        </div>
        {canManage && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => navigate("/projects")}>
              + New Project
            </button>
          </div>
        )}
      </div>

      <div className="stat-grid">
        <StatCard
          icon={FolderKanban}
          label="Total Projects"
          onClick={() => setDrillKey("total")}
          value={projects.length}
          trend={`${activeProjects.length} active`}
          color="#2563eb"
        />
        <StatCard
          icon={Activity}
          label="Active Projects"
          onClick={() => setDrillKey("active")}
          value={activeProjects.length}
          trend={`${dueThisWeek.length} due this week`}
          color="#f59e0b"
        />
        <StatCard
          icon={Clock}
          label="Pending Tasks"
          onClick={() => setDrillKey("pending")}
          value={pendingTasks.length}
          trend={`${highPriorityPending.length} high priority`}
          color="#dc2626"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Tasks"
          onClick={() => setDrillKey("completed")}
          value={completedTasks.length}
          trend="Across all projects"
          trendPositive
          color="#16a34a"
        />
      </div>

      <div className="flex-between mb-16">
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          Active Projects
        </h2>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/projects")}>
          View all
        </button>
      </div>

      {activeProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No active projects"
          description="Create a project to get started."
        />
      ) : (
        <div className="project-grid mb-16">
          {activeProjects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <div className="card card-padded mt-16">
        <h2 className="section-title">Upcoming Deadlines</h2>
        {upcomingTasks.length === 0 ? (
          <EmptyState icon={Clock} title="No upcoming deadlines" />
        ) : (
          <ul>
            {upcomingTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              const days = daysUntil(task.dueDate);
              return (
                <li
                  key={task.id}
                  className="flex-between"
                  style={{ padding: "10px 0", borderBottom: "1px solid var(--color-border)" }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{task.title}</div>
                    <div className="text-muted text-sm">{project?.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{formatDate(task.dueDate)}</div>
                    <div className={`text-sm ${days < 0 ? "" : ""}`} style={{ color: days < 2 ? "var(--color-danger)" : "var(--color-text-muted)" }}>
                      {days < 0 ? "Overdue" : days === 0 ? "Due today" : `${days} days left`}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {activeDrill && (
        <StatDrillDownModal
          key={drillKey}
          isOpen={!selectedTask}
          onClose={() => setDrillKey(null)}
          onSelectTask={(task) => setSelectedTaskId(task.id)}
          {...activeDrill}
        />
      )}

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTaskId(null)}
        task={selectedTask}
      />
    </div>
  );
}
