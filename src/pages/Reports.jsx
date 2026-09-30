import { useMemo } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { FolderKanban, CheckCircle2, Activity, ListChecks } from "lucide-react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/dashboard/StatCard";
import Loading from "../components/common/Loading";
import { CHART_COLORS } from "../utils/constants";

export default function Reports() {
  const { projects, tasks, isLoading } = useApp();

  const statusData = useMemo(() => {
    const statuses = ["To Do", "In Progress", "Review", "Completed"];
    return statuses.map((status) => ({
      name: status,
      value: tasks.filter((t) => t.status === status).length,
    }));
  }, [tasks]);

  const priorityData = useMemo(() => {
    const priorities = ["Low", "Medium", "High", "Urgent"];
    return priorities.map((priority) => ({
      name: priority,
      value: tasks.filter((t) => t.priority === priority).length,
    }));
  }, [tasks]);

  const projectProgressData = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter((t) => t.projectId === project.id);
      const completed = projectTasks.filter((t) => t.status === "Completed").length;
      const progress = projectTasks.length === 0 ? 0 : Math.round((completed / projectTasks.length) * 100);
      return { name: project.name.length > 16 ? `${project.name.slice(0, 16)}…` : project.name, progress };
    });
  }, [projects, tasks]);

  const completionOverTimeData = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.status === "Completed" && t.dueDate);
    const grouped = {};
    completedTasks.forEach((t) => {
      const month = new Date(t.dueDate).toLocaleString("en-US", { month: "short", year: "2-digit" });
      grouped[month] = (grouped[month] || 0) + 1;
    });
    return Object.entries(grouped)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`));
  }, [tasks]);

  if (isLoading) return <Loading />;

  const completedProjects = projects.filter((p) => p.status === "Completed").length;
  const activeProjects = projects.filter((p) => p.status === "In Progress").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Analytics and insights across all your projects and tasks.</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon={FolderKanban} label="Total Projects" value={projects.length} trend={`${completedProjects} completed`} color="#2563eb" />
        <StatCard icon={Activity} label="Active Projects" value={activeProjects} color="#f59e0b" />
        <StatCard icon={ListChecks} label="Total Tasks" value={tasks.length} trend={`${pendingTasks} pending`} color="#7c3aed" />
        <StatCard icon={CheckCircle2} label="Completed Tasks" value={completedTasks} trendPositive color="#16a34a" />
      </div>

      <div className="grid-2 mb-16">
        <div className="card card-padded">
          <h3 className="section-title">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-padded">
          <h3 className="section-title">Task Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {priorityData.map((entry, index) => (
                  <Cell key={entry.name} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card card-padded mb-16">
        <h3 className="section-title">Project Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectProgressData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
            <Tooltip />
            <Bar dataKey="progress" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card card-padded">
        <h3 className="section-title">Tasks Completed Over Time</h3>
        {completionOverTimeData.length === 0 ? (
          <p className="text-muted text-sm">No completed tasks with due dates yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={completionOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
