import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useUI } from "../../context/UIContext";

// App shell: sidebar + header + routed page content.
export default function Layout() {
  const { sidebarCollapsed } = useUI();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
