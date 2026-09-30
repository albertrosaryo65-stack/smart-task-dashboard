import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FolderKanban, ListChecks, Users } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useUI } from "../../context/UIContext";
import Dropdown from "../common/Dropdown";

// Global search across projects, tasks and team members.
// Results are grouped by category and clicking one navigates to it.
export default function GlobalSearch() {
  const { projects, tasks, users } = useApp();
  const { searchQuery, setSearchQuery } = useUI();
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    return {
      projects: projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5),
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 5),
      users: users.filter((u) => u.name.toLowerCase().includes(q)).slice(0, 5),
    };
  }, [searchQuery, projects, tasks, users]);

  const hasResults =
    results && (results.projects.length || results.tasks.length || results.users.length);

  return (
    <div className="header-search">
      <Dropdown
        align="left"
        trigger={(toggle) => (
          <div className="search-box" style={{ maxWidth: "none" }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search projects, tasks, team..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value) return;
              }}
              onFocus={toggle}
            />
          </div>
        )}
      >
        {searchQuery.trim() && (
          <div className="search-results-panel" onClick={(e) => e.stopPropagation()}>
            {!hasResults && (
              <div className="dropdown-item text-muted">No results found</div>
            )}
            {results.projects.length > 0 && (
              <>
                <div className="search-results-group-label">Projects</div>
                {results.projects.map((p) => (
                  <div
                    key={p.id}
                    className="dropdown-item"
                    onClick={() => {
                      navigate(`/projects/${p.id}`);
                      setSearchQuery("");
                    }}
                  >
                    <FolderKanban size={15} /> {p.name}
                  </div>
                ))}
              </>
            )}
            {results.tasks.length > 0 && (
              <>
                <div className="search-results-group-label">Tasks</div>
                {results.tasks.map((t) => (
                  <div
                    key={t.id}
                    className="dropdown-item"
                    onClick={() => {
                      navigate(`/tasks`);
                      setSearchQuery("");
                    }}
                  >
                    <ListChecks size={15} /> {t.title}
                  </div>
                ))}
              </>
            )}
            {results.users.length > 0 && (
              <>
                <div className="search-results-group-label">Team</div>
                {results.users.map((u) => (
                  <div
                    key={u.id}
                    className="dropdown-item"
                    onClick={() => {
                      navigate(`/team`);
                      setSearchQuery("");
                    }}
                  >
                    <Users size={15} /> {u.name}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </Dropdown>
    </div>
  );
}
