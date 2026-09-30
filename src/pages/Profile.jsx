import { useState } from "react";
import { useApp } from "../context/AppContext";
import { isAdmin } from "../utils/permissions";
import Avatar from "../components/common/Avatar";
import Badge from "../components/common/Badge";
import Loading from "../components/common/Loading";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function Profile() {
  const { currentUser, tasks, editUser, isLoading } = useApp();
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    senderEmail: currentUser?.senderEmail || currentUser?.email || "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  if (isLoading || !currentUser) return <Loading />;

  const canSetSenderEmail = isAdmin(currentUser);
  const myTasks = tasks.filter((t) => t.assigneeId === currentUser.id);
  const completed = myTasks.filter((t) => t.status === "Completed").length;

  function handleSave(e) {
    e.preventDefault();
    if (canSetSenderEmail && form.senderEmail && !EMAIL_PATTERN.test(form.senderEmail)) {
      setError("Enter a valid sender email address.");
      return;
    }
    setError("");
    const updates = { name: form.name.trim(), email: form.email.trim().toLowerCase() };
    if (canSetSenderEmail) updates.senderEmail = form.senderEmail.trim();
    editUser(currentUser.id, updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">View and update your personal information.</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card card-padded">
          <div className="flex-gap mb-16">
            <Avatar name={currentUser.name} color={currentUser.avatarColor} size={56} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{currentUser.name}</div>
              <Badge label={currentUser.role} />
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            {canSetSenderEmail && (
              <div className="form-group">
                <label className="form-label">Sender Email (for project emails)</label>
                <input
                  className={`form-input ${error ? "has-error" : ""}`}
                  value={form.senderEmail}
                  onChange={(e) => setForm((p) => ({ ...p, senderEmail: e.target.value }))}
                  placeholder="e.g. albertrosaryo65@gmail.com"
                />
                <div className="text-muted text-sm mt-8">
                  Shown as the "From" address on simulated emails sent for your projects. Defaults to your
                  account email above.
                </div>
                {error && <span className="form-error">{error}</span>}
              </div>
            )}

            <button type="submit" className="btn btn-primary">Save Changes</button>
            {saved && <span className="text-sm" style={{ color: "var(--color-success)", marginLeft: 10 }}>Saved!</span>}
          </form>
        </div>

        <div className="card card-padded">
          <h3 className="section-title">My Task Summary</h3>
          <div className="flex-between mb-16">
            <span className="text-sm text-muted">Total Assigned Tasks</span>
            <strong>{myTasks.length}</strong>
          </div>
          <div className="flex-between mb-16">
            <span className="text-sm text-muted">Completed Tasks</span>
            <strong>{completed}</strong>
          </div>
          <div className="flex-between">
            <span className="text-sm text-muted">Pending Tasks</span>
            <strong>{myTasks.length - completed}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
