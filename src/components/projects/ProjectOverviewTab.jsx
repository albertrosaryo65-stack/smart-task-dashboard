import ProgressBar from "../common/ProgressBar";
import { formatDate } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";

// Overview tab: summary, progress, and a simple timeline of recent activity.
export default function ProjectOverviewTab({ project, tasks, progress }) {
  const { users } = useApp();
  const manager = users.find((u) => u.id === project.managerId);

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .slice(0, 5);

  return (
    <div className="grid-2">
      <div className="card card-padded">
        <h3 className="section-title">Project Summary</h3>
        <p className="text-muted">{project.description || "No description provided."}</p>

        <div className="mt-16">
          <div className="flex-between" style={{ marginBottom: 6 }}>
            <span className="text-sm text-muted">Overall Progress</span>
            <span className="text-sm" style={{ fontWeight: 700 }}>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>

        <div className="grid-2 mt-16">
          <div>
            <div className="text-sm text-muted">Start Date</div>
            <div style={{ fontWeight: 600 }}>{formatDate(project.startDate)}</div>
          </div>
          <div>
            <div className="text-sm text-muted">Due Date</div>
            <div style={{ fontWeight: 600 }}>{formatDate(project.endDate)}</div>
          </div>
        </div>
        <div className="mt-16">
          <div className="text-sm text-muted">Project Manager</div>
          <div style={{ fontWeight: 600 }}>{manager?.name || "Unassigned"}</div>
        </div>
      </div>

      <div className="card card-padded">
        <h3 className="section-title">Recent Activity</h3>
        {recentTasks.length === 0 ? (
          <p className="text-muted text-sm">No tasks yet.</p>
        ) : (
          <ul>
            {recentTasks.map((task) => (
              <li key={task.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{task.title}</div>
                <div className="text-muted text-sm">
                  Created on {formatDate(task.createdDate)} · Status: {task.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
