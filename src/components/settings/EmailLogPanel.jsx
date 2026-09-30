import { useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";
import EmptyState from "../common/EmptyState";
import Modal from "../common/Modal";
import Badge from "../common/Badge";
import { EMAIL_TEMPLATE_META } from "../../utils/constants";

// Data-table view of simulated outbound emails (see emailLogService), with
// search + template filter and a detail modal for the full rendered body.
export default function EmailLogPanel({ emails }) {
  const [search, setSearch] = useState("");
  const [templateFilter, setTemplateFilter] = useState("");
  const [viewingEmail, setViewingEmail] = useState(null);

  const filtered = useMemo(() => {
    return emails.filter((email) => {
      if (templateFilter && email.templateKey !== templateFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${email.subject} ${email.to} ${email.from || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [emails, search, templateFilter]);

  if (emails.length === 0) {
    return <EmptyState icon={Search} title="No emails sent yet" description="Emails appear here when a task or project status changes." />;
  }

  return (
    <div>
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by subject, sender or recipient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={templateFilter} onChange={(e) => setTemplateFilter(e.target.value)}>
          <option value="">All Templates</option>
          {Object.entries(EMAIL_TEMPLATE_META).map(([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No emails match your search" description="Try adjusting your search or filter." />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>From</th>
                <th>To</th>
                <th>Template</th>
                <th>Sent At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((email) => (
                <tr key={email.id}>
                  <td style={{ fontWeight: 600, maxWidth: 260 }}>{email.subject}</td>
                  <td className="text-muted">{email.from || "—"}</td>
                  <td className="text-muted">{email.to}</td>
                  <td><Badge label={EMAIL_TEMPLATE_META[email.templateKey]?.label || email.templateKey} variant="badge-gray" /></td>
                  <td className="text-muted">{new Date(email.sentAt).toLocaleString()}</td>
                  <td>
                    <button className="btn-icon" onClick={() => setViewingEmail(email)} title="View">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!viewingEmail}
        onClose={() => setViewingEmail(null)}
        title={viewingEmail?.subject}
        subtitle={
          viewingEmail
            ? `From: ${viewingEmail.from || "—"} · To: ${viewingEmail.to} · ${new Date(viewingEmail.sentAt).toLocaleString()}`
            : undefined
        }
      >
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 13 }}>
          {viewingEmail?.body}
        </pre>
      </Modal>
    </div>
  );
}
