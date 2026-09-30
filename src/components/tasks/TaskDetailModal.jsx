import Modal from "../common/Modal";
import Badge from "../common/Badge";
import Avatar from "../common/Avatar";
import FeedbackForm from "../common/FeedbackForm";
import FeedbackSummary from "../common/FeedbackSummary";
import { formatDate } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";

// Read-only detail view for a single task ("View" action).
export default function TaskDetailModal({ isOpen, onClose, task }) {
  const { projects, users, addTaskFeedback } = useApp();
  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const assignee = users.find((u) => u.id === task.assigneeId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title}>
      <div className="flex-gap mb-16">
        <Badge label={task.status} />
        <Badge label={task.priority} />
      </div>

      <p className="text-muted mb-16">{task.description || "No description provided."}</p>

      <div className="grid-2">
        <div>
          <div className="text-sm text-muted">Project</div>
          <div style={{ fontWeight: 600 }}>{project?.name || "—"}</div>
        </div>
        <div>
          <div className="text-sm text-muted">Assignee</div>
          {assignee ? (
            <div className="flex-gap mt-8">
              <Avatar name={assignee.name} color={assignee.avatarColor} size={26} />
              <span style={{ fontWeight: 600 }}>{assignee.name}</span>
            </div>
          ) : (
            <div style={{ fontWeight: 600 }}>Unassigned</div>
          )}
        </div>
        <div className="mt-16">
          <div className="text-sm text-muted">Due Date</div>
          <div style={{ fontWeight: 600 }}>{formatDate(task.dueDate)}</div>
        </div>
        <div className="mt-16">
          <div className="text-sm text-muted">Created Date</div>
          <div style={{ fontWeight: 600 }}>{formatDate(task.createdDate)}</div>
        </div>
      </div>

      {task.tags?.length > 0 && (
        <div className="mt-16">
          <div className="text-sm text-muted mb-16">Tags</div>
          <div className="flex-gap" style={{ flexWrap: "wrap" }}>
            {task.tags.map((tag) => (
              <Badge key={tag} label={tag} variant="badge-gray" />
            ))}
          </div>
        </div>
      )}

      {task.status === "Completed" && (
        <div className="mt-16" style={{ paddingTop: 16, borderTop: "1px solid var(--color-border)" }}>
          <div className="text-sm text-muted mb-16" style={{ fontWeight: 600 }}>Feedback</div>
          {task.feedback ? (
            <FeedbackSummary
              feedback={task.feedback}
              authorName={users.find((u) => u.id === task.feedback.byUserId)?.name}
            />
          ) : (
            <FeedbackForm onSubmit={(data) => addTaskFeedback(task.id, data)} />
          )}
        </div>
      )}
    </Modal>
  );
}
