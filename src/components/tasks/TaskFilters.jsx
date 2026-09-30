import { Search } from "lucide-react";
import { TASK_STATUS_LIST, TASK_PRIORITY_LIST } from "../../utils/constants";
import { useApp } from "../../context/AppContext";
import MultiSelectDropdown from "../common/MultiSelectDropdown";

// Search + multi-select status/priority/project filters + sort, shared by
// Tasks page and the Tasks tab inside Project Details.
export default function TaskFilters({ filters, setFilters, showProjectFilter = true }) {
  const { projects } = useApp();

  function update(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  const statusOptions = TASK_STATUS_LIST.map((s) => ({ value: s, label: s }));
  const priorityOptions = TASK_PRIORITY_LIST.map((p) => ({ value: p, label: p }));
  const projectOptions = projects.map((p) => ({ value: p.id, label: p.name }));

  return (
    <div className="toolbar">
      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>

      <MultiSelectDropdown
        label="Statuses"
        options={statusOptions}
        selected={filters.status}
        onChange={(value) => update("status", value)}
      />

      <MultiSelectDropdown
        label="Priorities"
        options={priorityOptions}
        selected={filters.priority}
        onChange={(value) => update("priority", value)}
      />

      {showProjectFilter && (
        <MultiSelectDropdown
          label="Projects"
          options={projectOptions}
          selected={filters.projectId}
          onChange={(value) => update("projectId", value)}
        />
      )}

      <select className="filter-select" value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
        <option value="dueDate">Sort: Due Date</option>
        <option value="priority">Sort: Priority</option>
        <option value="title">Sort: Title (A-Z)</option>
      </select>
    </div>
  );
}
