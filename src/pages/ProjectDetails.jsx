import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, ListChecks, CheckCircle2, Activity, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import Badge from "../components/common/Badge";
import StatCard from "../components/dashboard/StatCard";
import ProjectOverviewTab from "../components/projects/ProjectOverviewTab";
import ProjectTeamTab from "../components/projects/ProjectTeamTab";
import FeedbackForm from "../components/common/FeedbackForm";
import FeedbackSummary from "../components/common/FeedbackSummary";
import TaskTable from "../components/tasks/TaskTable";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskFormModal from "../components/tasks/TaskFormModal";
import TaskDetailModal from "../components/tasks/TaskDetailModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Loading from "../components/common/Loading";
import { calculateProjectProgress, formatDate } from "../utils/helpers";
import { filterAndSortTasks, defaultTaskFilters } from "../utils/taskFilterUtils";
import { canViewProject, canManageProjects } from "../utils/permissions";

const TABS = ["Overview", "Tasks", "Team", "Activity", "Feedback"];

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, users, currentUser, addTask, editTask, removeTask, addProjectFeedback, isLoading } = useApp();

  const [activeTab, setActiveTab] = useState("Overview");
  const [filters, setFilters] = useState(defaultTaskFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  if (isLoading) return <Loading />;

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="This project may have been deleted."
        action={<button className="btn btn-primary btn-sm" onClick={() => navigate("/projects")}>Back to Projects</button>}
      />
    );
  }

  if (!canViewProject(currentUser, project)) {
    return (
      <EmptyState
        title="No access to this project"
        description="You're not a member of this project."
        action={<button className="btn btn-primary btn-sm" onClick={() => navigate("/projects")}>Back to Projects</button>}
      />
    );
  }

  const canManage = canManageProjects(currentUser);
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const progress = calculateProjectProgress(project, tasks);
  const manager = users.find((u) => u.id === project.managerId);
  const team = users.filter((u) => project.teamIds?.includes(u.id));

  const completed = projectTasks.filter((t) => t.status === "Completed").length;
  const inProgress = projectTasks.filter((t) => t.status === "In Progress").length;
  const pending = projectTasks.filter((t) => t.status === "To Do" || t.status === "Review").length;

  const visibleTasks = filterAndSortTasks(projectTasks, filters);

  function handleSubmit(data) {
    if (editingTask) {
      editTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  }

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-16" onClick={() => navigate("/projects")}>
        <ArrowLeft size={15} /> Back to Projects
      </button>

      <div className="page-header">
        <div>
          <div className="flex-gap">
            <h1 className="page-title">{project.name}</h1>
            <Badge label={project.status} />
            <Badge label={project.priority} />
          </div>
          <p className="page-subtitle">{project.description}</p>
          <p className="text-sm text-muted mt-8">
            Due {formatDate(project.endDate)} · Managed by {manager?.name || "Unassigned"}
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon={ListChecks} label="Total Tasks" value={projectTasks.length} color="#2563eb" />
        <StatCard icon={CheckCircle2} label="Completed" value={completed} color="#16a34a" />
        <StatCard icon={Activity} label="In Progress" value={inProgress} color="#f59e0b" />
        <StatCard icon={Clock} label="Pending" value={pending} color="#dc2626" />
      </div>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <ProjectOverviewTab project={project} tasks={projectTasks} progress={progress} />
      )}

      {activeTab === "Tasks" && (
        <div>
          <div className="flex-between mb-16">
            <div style={{ flex: 1 }}>
              <TaskFilters filters={filters} setFilters={setFilters} showProjectFilter={false} />
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingTask(null);
                setFormOpen(true);
              }}
            >
              <Plus size={15} /> Add Task
            </button>
          </div>
          <div className="card">
            <TaskTable
              tasks={visibleTasks}
              onView={setViewingTask}
              onEdit={(task) => {
                setEditingTask(task);
                setFormOpen(true);
              }}
              onDelete={setDeletingTask}
            />
          </div>
        </div>
      )}

      {activeTab === "Team" && <ProjectTeamTab team={team} tasks={projectTasks} />}

      {activeTab === "Activity" && (
        <div className="card card-padded">
          <h3 className="section-title">Recent Activity</h3>
          <ul>
            {[...projectTasks]
              .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
              .map((task) => {
                const assignee = users.find((u) => u.id === task.assigneeId);
                return (
                  <li key={task.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--color-border)" }}>
                    <span style={{ fontWeight: 600 }}>{assignee?.name || "Someone"}</span>{" "}
                    {task.status === "Completed" ? "completed" : "created"} task{" "}
                    <span style={{ fontWeight: 600 }}>"{task.title}"</span>
                    <div className="text-muted text-sm">{formatDate(task.createdDate)}</div>
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      {activeTab === "Feedback" && (
        <div className="card card-padded" style={{ maxWidth: 520 }}>
          <h3 className="section-title">Project Feedback</h3>
          {project.feedback ? (
            <FeedbackSummary
              feedback={project.feedback}
              authorName={users.find((u) => u.id === project.feedback.byUserId)?.name}
            />
          ) : (
            <FeedbackForm onSubmit={(data) => addProjectFeedback(project.id, data)} />
          )}
        </div>
      )}

      <TaskFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={editingTask}
        defaultProjectId={project.id}
        onSubmit={handleSubmit}
      />
      <TaskDetailModal isOpen={!!viewingTask} onClose={() => setViewingTask(null)} task={viewingTask} />
      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => removeTask(deletingTask.id)}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"?`}
      />
    </div>
  );
}
