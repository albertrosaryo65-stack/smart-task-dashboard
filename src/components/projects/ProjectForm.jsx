import { useState } from "react";
import { PROJECT_STATUS_LIST, PROJECT_PRIORITY_LIST } from "../../utils/constants";
import { useApp } from "../../context/AppContext";

// Reusable create/edit form for a Project.
export default function ProjectForm({ initialData, onSubmit }) {
  const { users } = useApp();

  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    status: initialData?.status || "Planning",
    priority: initialData?.priority || "Medium",
    managerId: initialData?.managerId || "",
    teamIds: initialData?.teamIds || [],
  });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleTeamMember(userId) {
    setForm((prev) => ({
      ...prev,
      teamIds: prev.teamIds.includes(userId)
        ? prev.teamIds.filter((id) => id !== userId)
        : [...prev.teamIds, userId],
    }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Project name is required.";
    if (!form.startDate) newErrors.startDate = "Start date is required.";
    if (form.endDate && form.startDate && form.endDate < form.startDate) {
      newErrors.endDate = "End date must not be before start date.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} id="project-form">
      <div className="form-group">
        <label className="form-label">Project Name</label>
        <input
          className={`form-input ${errors.name ? "has-error" : ""}`}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. E-Commerce Website"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Short project description..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className={`form-input ${errors.startDate ? "has-error" : ""}`}
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
          {errors.startDate && <span className="form-error">{errors.startDate}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className={`form-input ${errors.endDate ? "has-error" : ""}`}
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}
          />
          {errors.endDate && <span className="form-error">{errors.endDate}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={(e) => update("status", e.target.value)}>
            {PROJECT_STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select className="form-select" value={form.priority} onChange={(e) => update("priority", e.target.value)}>
            {PROJECT_PRIORITY_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Project Manager</label>
        <select className="form-select" value={form.managerId} onChange={(e) => update("managerId", e.target.value)}>
          <option value="">Unassigned</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Team Members</label>
        <div className="checkbox-group">
          {users.map((u) => (
            <label
              key={u.id}
              className={`checkbox-pill ${form.teamIds.includes(u.id) ? "checked" : ""}`}
            >
              <input
                type="checkbox"
                checked={form.teamIds.includes(u.id)}
                onChange={() => toggleTeamMember(u.id)}
                style={{ display: "none" }}
              />
              {u.name}
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}
