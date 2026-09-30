import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "../common/Badge";
import Avatar from "../common/Avatar";
import EmptyState from "../common/EmptyState";
import { formatDate, isOverdue } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";
import { canEditTask, canDeleteTask } from "../../utils/permissions";

// Task table (desktop) + task cards (mobile, via CSS breakpoint).
export default function TaskTable({ tasks, onView, onEdit, onDelete }) {
  const { projects, users, currentUser } = useApp();

  const getProject = (id) => projects.find((p) => p.id === id);
  const getAssignee = (id) => users.find((u) => u.id === id);

  if (tasks.length === 0) {
    return <EmptyState title="No tasks found" description="Try adjusting your filters or create a new task." />;
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const project = getProject(task.projectId);
              const assignee = getAssignee(task.assigneeId);
              const overdue = isOverdue(task.dueDate, task.status);
              const canEdit = canEditTask(currentUser, task);
              const canDelete = canDeleteTask(currentUser, task);
              return (
                <tr key={task.id}>
                  <td style={{ fontWeight: 600, maxWidth: 220 }}>{task.title}</td>
                  <td className="text-muted">{project?.name || "—"}</td>
                  <td>
                    {assignee ? (
                      <div className="flex-gap">
                        <Avatar name={assignee.name} color={assignee.avatarColor} size={26} />
                        <span className="text-sm">{assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted text-sm">Unassigned</span>
                    )}
                  </td>
                  <td><Badge label={task.priority} /></td>
                  <td><Badge label={task.status} /></td>
                  <td style={{ color: overdue ? "var(--color-danger)" : "inherit" }}>
                    {formatDate(task.dueDate)}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-icon" onClick={() => onView(task)} title="View"><Eye size={16} /></button>
                      {canEdit && (
                        <button className="btn-icon" onClick={() => onEdit(task)} title="Edit"><Pencil size={16} /></button>
                      )}
                      {canDelete && (
                        <button className="btn-icon" onClick={() => onDelete(task)} title="Delete"><Trash2 size={16} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="task-cards">
        {tasks.map((task) => {
          const project = getProject(task.projectId);
          const assignee = getAssignee(task.assigneeId);
          const canEdit = canEditTask(currentUser, task);
          const canDelete = canDeleteTask(currentUser, task);
          return (
            <div key={task.id} className="card task-card">
              <div className="task-card-top">
                <div className="task-card-title">{task.title}</div>
                <Badge label={task.priority} />
              </div>
              <div className="text-muted text-sm">{project?.name}</div>
              <div className="task-card-meta">
                <Badge label={task.status} />
                <span>Due {formatDate(task.dueDate)}</span>
              </div>
              <div className="task-card-footer">
                {assignee ? (
                  <div className="flex-gap">
                    <Avatar name={assignee.name} color={assignee.avatarColor} size={24} />
                    <span className="text-sm">{assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-muted text-sm">Unassigned</span>
                )}
                <div className="row-actions">
                  <button className="btn-icon" onClick={() => onView(task)}><Eye size={16} /></button>
                  {canEdit && (
                    <button className="btn-icon" onClick={() => onEdit(task)}><Pencil size={16} /></button>
                  )}
                  {canDelete && (
                    <button className="btn-icon" onClick={() => onDelete(task)}><Trash2 size={16} /></button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
