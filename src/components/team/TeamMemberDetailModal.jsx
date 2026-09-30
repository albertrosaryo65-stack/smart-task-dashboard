import Modal from "../common/Modal";
import Badge from "../common/Badge";
import Avatar from "../common/Avatar";
import { formatDate } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";

// Read-only detail view for a team member: their assigned tasks.
export default function TeamMemberDetailModal({ isOpen, onClose, member }) {
  const { tasks, projects } = useApp();
  if (!member) return null;

  const memberTasks = tasks.filter((t) => t.assigneeId === member.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={member.name}>
      <div className="flex-gap mb-16">
        <Avatar name={member.name} color={member.avatarColor} size={48} />
        <div>
          <div style={{ fontWeight: 700 }}>{member.role}</div>
          <div className="text-muted text-sm">{member.email}</div>
        </div>
      </div>

      <h4 className="mb-16">Assigned Tasks ({memberTasks.length})</h4>
      {memberTasks.length === 0 ? (
        <p className="text-muted text-sm">No tasks assigned yet.</p>
      ) : (
        <ul>
          {memberTasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            return (
              <li key={task.id} className="flex-between" style={{ padding: "10px 0", borderBottom: "1px solid var(--color-border)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{task.title}</div>
                  <div className="text-muted text-sm">{project?.name} · Due {formatDate(task.dueDate)}</div>
                </div>
                <Badge label={task.status} />
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
