import { useState } from "react";
import { TASK_STATUS_LIST, TASK_PRIORITY_LIST } from "../../utils/constants";
import { useApp } from "../../context/AppContext";
import { visibleProjects } from "../../utils/permissions";

// Reusable create/edit form for a Task. Parent controls open state and
// receives the validated data through onSubmit.
export default function TaskForm({ initialData, defaultProjectId, onSubmit }) {
  const { projects: allProjects, users, currentUser } = useApp();
  const projects = visibleProjects(currentUser, allProjects);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    projectId: initialData?.projectId || defaultProjectId || "",
    assigneeId: initialData?.assigneeId || "",
    priority: initialData?.priority || "Medium",
    status: initialData?.status || "To Do",
    dueDate: initialData?.dueDate || "",
    tags: initialData?.tags?.join(", ") || "",
  });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Task title is required.";
    if (!form.projectId) newErrors.projectId = "Project is required.";
    if (!form.status) newErrors.status = "Status is required.";
    if (initialData?.createdDate && form.dueDate && form.dueDate < initialData.createdDate) {
      newErrors.dueDate = "Due date cannot be before the creation date.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit} id="task-form">
      <div className="form-group">
        <label className="form-label">Task Title</label>
        <input
          className={`form-input ${errors.title ? "has-error" : ""}`}
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Design login page"
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe the task..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Project</label>
          <select
            className={`form-select ${errors.projectId ? "has-error" : ""}`}
            value={form.projectId}
            onChange={(e) => update("projectId", e.target.value)}
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.projectId && <span className="form-error">{errors.projectId}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Assignee</label>
          <select
            className="form-select"
            value={form.assigneeId}
            onChange={(e) => update("assigneeId", e.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            value={form.priority}
            onChange={(e) => update("priority", e.target.value)}
          >
            {TASK_PRIORITY_LIST.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            {TASK_STATUS_LIST.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            className={`form-input ${errors.dueDate ? "has-error" : ""}`}
            value={form.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
          />
          {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Tags (comma separated)</label>
          <input
            className="form-input"
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
            placeholder="e.g. Frontend, Bug"
          />
        </div>
      </div>
    </form>
  );
}
