import { useState } from "react";
import { TEAM_ROLES } from "../../utils/constants";
import { useApp } from "../../context/AppContext";
import PasswordInput from "../common/PasswordInput";

// Create/edit form for a team member (User).
export default function TeamMemberForm({ initialData, onSubmit, canSetPassword = true }) {
  const { users } = useApp();

  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || TEAM_ROLES[0],
    status: initialData?.status || "Active",
  });
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    const cleanEmail = form.email.trim();
    if (!cleanEmail) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      newErrors.email = "Enter a valid email address.";
    } else {
      const isDuplicate = (users || []).some(
        (u) =>
          (u.email || "").trim().toLowerCase() === cleanEmail.toLowerCase() &&
          u.id !== initialData?.id
      );
      if (isDuplicate) {
        newErrors.email = "A team member with this email already exists.";
      }
    }

    if (password.trim() && password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
    };
    if (canSetPassword) {
      if (password.trim()) {
        data.password = password.trim();
      } else if (!initialData) {
        data.password = "password123";
      }
    }
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit} id="team-form">
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input
          className={`form-input ${errors.name ? "has-error" : ""}`}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Priya Sharma"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          className={`form-input ${errors.email ? "has-error" : ""}`}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="e.g. priya@example.com"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      {canSetPassword && (
        <div className="form-group">
          <label className="form-label">
            {initialData ? "Reset Password" : "Set Password"}
          </label>
          <PasswordInput
            inputClassName={errors.password ? "has-error" : ""}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              initialData
                ? "Leave blank to keep current password"
                : "Enter password (leave blank for 'password123')"
            }
            autoComplete="new-password"
          />
          <div className="text-sm text-muted mt-8">
            {initialData
              ? "Leave blank to keep the member's current password."
              : "Default password is 'password123' if left blank."}
          </div>
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-select" value={form.role} onChange={(e) => update("role", e.target.value)}>
            {TEAM_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="Active">Active</option>
            <option value="Away">Away</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>
    </form>
  );
}

