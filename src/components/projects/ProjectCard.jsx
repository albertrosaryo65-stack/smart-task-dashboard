import { useNavigate } from "react-router-dom";
import { Calendar, ListChecks, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";
import Avatar from "../common/Avatar";
import Dropdown from "../common/Dropdown";
import { formatDate, calculateProjectProgress, truncate } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";

// Project summary card used on Dashboard and Projects pages.
export default function ProjectCard({ project, onEdit, onDelete }) {
  const { tasks, users } = useApp();
  const navigate = useNavigate();

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completedTasks = projectTasks.filter((t) => t.status === "Completed").length;
  const progress = calculateProjectProgress(project, tasks);
  const team = users.filter((u) => project.teamIds?.includes(u.id));

  return (
    <div className="card card-padded project-card">
      <div className="flex-between">
        <h3 style={{ fontSize: 15.5, fontWeight: 700 }}>{project.name}</h3>
        <div className="flex-gap">
          <Badge label={project.priority} />
          {(onEdit || onDelete) && (
            <Dropdown
              trigger={(toggle) => (
                <button className="btn-icon" onClick={toggle} aria-label="Project actions">
                  <MoreVertical size={16} />
                </button>
              )}
            >
              {onEdit && (
                <div className="dropdown-item" onClick={() => onEdit(project)}>
                  <Pencil size={14} /> Edit
                </div>
              )}
              {onDelete && (
                <div className="dropdown-item" onClick={() => onDelete(project)}>
                  <Trash2 size={14} /> Delete
                </div>
              )}
            </Dropdown>
          )}
        </div>
      </div>

      <p className="text-muted text-sm mt-8" style={{ minHeight: 36 }}>
        {truncate(project.description, 90)}
      </p>

      <div className="flex-between mt-16" style={{ marginBottom: 6 }}>
        <span className="text-sm text-muted">Progress</span>
        <span className="text-sm" style={{ fontWeight: 700 }}>{progress}%</span>
      </div>
      <ProgressBar value={progress} />

      <div className="flex-between mt-16">
        <div className="flex-gap text-sm text-muted">
          <Calendar size={14} /> {formatDate(project.endDate)}
        </div>
        <div className="flex-gap text-sm text-muted">
          <ListChecks size={14} /> {completedTasks}/{projectTasks.length}
        </div>
      </div>

      <div className="flex-between mt-16">
        <div className="avatar-group">
          {team.slice(0, 4).map((member) => (
            <Avatar key={member.id} name={member.name} color={member.avatarColor} size={28} />
          ))}
        </div>
        <Badge label={project.status} />
      </div>

      <button
        className="btn btn-secondary btn-sm mt-16"
        style={{ width: "100%" }}
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        View Project
      </button>
    </div>
  );
}
