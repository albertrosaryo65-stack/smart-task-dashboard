import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, Inbox } from "lucide-react";
import Modal from "../common/Modal";
import Badge from "../common/Badge";
import Avatar from "../common/Avatar";
import ProgressBar from "../common/ProgressBar";
import { useApp } from "../../context/AppContext";
import { calculateProjectProgress, daysUntil, formatDate } from "../../utils/helpers";

// Relative due-date label shown under each date ("Overdue", "Due today", "3 days left").
function dueLabel(dateString, isDone) {
  if (isDone) return { text: "Done", tone: "success" };
  const days = daysUntil(dateString);
  if (days === null || Number.isNaN(days)) return null;
  if (days < 0) return { text: `Overdue by ${Math.abs(days)} day${days === -1 ? "" : "s"}`, tone: "danger" };
  if (days === 0) return { text: "Due today", tone: "danger" };
  return { text: `${days} day${days === 1 ? "" : "s"} left`, tone: days <= 7 ? "warning" : "muted" };
}

function DueCell({ date, isDone }) {
  const label = dueLabel(date, isDone);
  return (
    <div>
      <div style={{ fontWeight: 600 }}>{formatDate(date)}</div>
      {label && <div className={`drill-due drill-due-${label.tone}`}>{label.text}</div>}
    </div>
  );
}

// Drill-down dialog opened from a Dashboard stat card.
// `type` is "projects" or "tasks"; `filters` is a list of { key, label, test } chips.
export default function StatDrillDownModal({
  isOpen,
  onClose,
  title,
  subtitle,
  type,
  items,
  filters,
  onSelectTask,
}) {
  const { projects, tasks, users } = useApp();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(filters[0]?.key);
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => Object.fromEntries(filters.map((f) => [f.key, items.filter(f.test).length])),
    [filters, items]
  );

  const visibleItems = useMemo(() => {
    const filter = filters.find((f) => f.key === activeFilter) || filters[0];
    const q = query.trim().toLowerCase();
    return items
      .filter((item) => (filter ? filter.test(item) : true))
      .filter((item) => {
        if (!q) return true;
        const name = type === "projects" ? item.name : item.title;
        const projectName =
          type === "tasks" ? projects.find((p) => p.id === item.projectId)?.name : "";
        return `${name} ${projectName || ""}`.toLowerCase().includes(q);
      });
  }, [items, filters, activeFilter, query, type, projects]);

  function openProject(projectId) {
    onClose();
    navigate(`/projects/${projectId}`);
  }

  const footer = (
    <>
      <span className="text-sm text-muted" style={{ marginRight: "auto" }}>
        Showing {visibleItems.length} of {items.length}
      </span>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => {
          onClose();
          navigate(type === "projects" ? "/projects" : "/tasks");
        }}
      >
        Go to {type === "projects" ? "Projects" : "My Tasks"}
      </button>
      <button className="btn btn-primary btn-sm" onClick={onClose}>
        Close
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle} size="xl" footer={footer}>
      <div className="drill-toolbar">
        <div className="drill-chips" role="tablist">
          {filters.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={activeFilter === f.key}
              className={`drill-chip ${activeFilter === f.key ? "active" : ""}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
              <span className="drill-chip-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
        <div className="search-box drill-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder={type === "projects" ? "Search projects..." : "Search tasks or projects..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <div className="drill-empty">
          <Inbox size={28} />
          <div style={{ fontWeight: 600 }}>Nothing to show</div>
          <div className="text-sm">Try a different filter or search term.</div>
        </div>
      ) : (
        <div className="table-wrapper drill-table-wrapper">
          {type === "projects" ? (
            <table className="data-table drill-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th style={{ minWidth: 160 }}>Progress</th>
                  <th>Tasks</th>
                  <th>Due Date</th>
                  <th>Team</th>
                  <th aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((project) => {
                  const projectTasks = tasks.filter((t) => t.projectId === project.id);
                  const done = projectTasks.filter((t) => t.status === "Completed").length;
                  const progress = calculateProjectProgress(project, tasks);
                  const team = users.filter((u) => project.teamIds?.includes(u.id));
                  return (
                    <tr
                      key={project.id}
                      className="drill-row"
                      tabIndex={0}
                      onClick={() => openProject(project.id)}
                      onKeyDown={(e) => e.key === "Enter" && openProject(project.id)}
                    >
                      <td>
                        <div style={{ fontWeight: 600 }}>{project.name}</div>
                        <div className="text-sm text-muted drill-desc">{project.description}</div>
                      </td>
                      <td><Badge label={project.status} /></td>
                      <td><Badge label={project.priority} /></td>
                      <td>
                        <div className="flex-between text-sm" style={{ marginBottom: 4 }}>
                          <span className="text-muted">{done}/{projectTasks.length} done</span>
                          <span style={{ fontWeight: 700 }}>{progress}%</span>
                        </div>
                        <ProgressBar value={progress} />
                      </td>
                      <td style={{ fontWeight: 600 }}>{projectTasks.length}</td>
                      <td><DueCell date={project.endDate} isDone={project.status === "Completed"} /></td>
                      <td>
                        <div className="avatar-group">
                          {team.slice(0, 4).map((m) => (
                            <Avatar key={m.id} name={m.name} color={m.avatarColor} size={26} />
                          ))}
                          {team.length > 4 && <span className="text-sm text-muted" style={{ marginLeft: 6 }}>+{team.length - 4}</span>}
                        </div>
                      </td>
                      <td className="drill-chevron"><ChevronRight size={16} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="data-table drill-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  const assignee = users.find((u) => u.id === task.assigneeId);
                  return (
                    <tr
                      key={task.id}
                      className="drill-row"
                      tabIndex={0}
                      onClick={() => onSelectTask(task)}
                      onKeyDown={(e) => e.key === "Enter" && onSelectTask(task)}
                    >
                      <td style={{ fontWeight: 600 }}>{task.title}</td>
                      <td className="text-muted">{project?.name || "—"}</td>
                      <td>
                        {assignee ? (
                          <div className="flex-gap">
                            <Avatar name={assignee.name} color={assignee.avatarColor} size={24} />
                            <span className="text-sm">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted">Unassigned</span>
                        )}
                      </td>
                      <td><Badge label={task.priority} /></td>
                      <td><Badge label={task.status} /></td>
                      <td><DueCell date={task.dueDate} isDone={task.status === "Completed"} /></td>
                      <td className="drill-chevron"><ChevronRight size={16} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </Modal>
  );
}
