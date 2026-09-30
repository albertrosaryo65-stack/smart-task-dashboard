import { MoreVertical, Pencil, Trash2, Mail } from "lucide-react";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import Dropdown from "../common/Dropdown";
import { useApp } from "../../context/AppContext";

const STATUS_VARIANT = {
  Active: "badge-green",
  Away: "badge-orange",
  Offline: "badge-gray",
};

// Team member card shown on the Team page.
export default function TeamMemberCard({ member, onEdit, onDelete, onView }) {
  const { tasks } = useApp();
  const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
  const completedTasks = memberTasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="card card-padded">
      <div className="flex-between">
        <div className="flex-gap" style={{ cursor: "pointer" }} onClick={() => onView(member)}>
          <Avatar name={member.name} color={member.avatarColor} size={44} />
          <div>
            <div style={{ fontWeight: 700 }}>{member.name}</div>
            <div className="text-muted text-sm">{member.role}</div>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <Dropdown
            trigger={(toggle) => (
              <button className="btn-icon" onClick={toggle}>
                <MoreVertical size={16} />
              </button>
            )}
          >
            {onEdit && (
              <div className="dropdown-item" onClick={() => onEdit(member)}>
                <Pencil size={14} /> Edit
              </div>
            )}
            {onDelete && (
              <div className="dropdown-item" onClick={() => onDelete(member)}>
                <Trash2 size={14} /> Delete
              </div>
            )}
          </Dropdown>
        )}
      </div>

      <div className="flex-gap text-sm text-muted mt-16">
        <Mail size={14} /> {member.email}
      </div>

      <div className="flex-between mt-16">
        <Badge label={member.status} variant={STATUS_VARIANT[member.status]} />
        <span className="text-sm text-muted">
          {completedTasks}/{memberTasks.length} tasks done
        </span>
      </div>
    </div>
  );
}
