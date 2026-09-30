import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  Calendar,
  Users,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  CheckSquare,
} from "lucide-react";
import { useUI } from "../../context/UIContext";

const mainNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "My Tasks", icon: ListChecks },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/team", label: "Team", icon: Users },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

const accountNav = [
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, closeMobileSidebar } = useUI();

  return (
    <>
      {mobileSidebarOpen && <div className="sidebar-backdrop" onClick={closeMobileSidebar} />}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <CheckSquare size={20} />
          </div>
          {!sidebarCollapsed && <span className="brand-name">Smart Task</span>}
        </div>

        <nav className="sidebar-nav">
          <ul>
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                  title={item.label}
                >
                  <item.icon size={19} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="sidebar-divider" />

          <ul>
            {accountNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                  title={item.label}
                >
                  <item.icon size={19} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button className="sidebar-collapse-btn" onClick={toggleSidebar} title="Toggle sidebar">
          {sidebarCollapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}
        </button>
      </aside>
    </>
  );
}
