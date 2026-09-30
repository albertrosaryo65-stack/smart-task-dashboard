import { Inbox } from "lucide-react";

// Shown when a list/table has no data (no results, or nothing created yet).
export default function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={24} />
      </div>
      <div className="empty-state-title">{title}</div>
      {description && <p className="text-sm">{description}</p>}
      {action && <div className="mt-16">{action}</div>}
    </div>
  );
}
