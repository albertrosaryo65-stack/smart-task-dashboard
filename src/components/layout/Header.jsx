import { useNavigate } from "react-router-dom";
import { Menu, Bell, User, Settings, LogOut, CheckCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useUI } from "../../context/UIContext";
import Avatar from "../common/Avatar";
import Dropdown from "../common/Dropdown";
import GlobalSearch from "./GlobalSearch";
import { formatDate } from "../../utils/helpers";

export default function Header() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead, logout } = useApp();
  const { toggleMobileSidebar } = useUI();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="btn-icon header-menu-btn" onClick={toggleMobileSidebar} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <GlobalSearch />
      </div>

      <div className="header-right">
        <Dropdown
          trigger={(toggle) => (
            <button className="btn-icon notif-badge-wrapper" onClick={toggle} aria-label="Notifications">
              <Bell size={19} />
              {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
            </button>
          )}
        >
          <div className="notif-panel">
            <div className="flex-between" style={{ padding: "10px 14px" }}>
              <strong style={{ fontSize: 13.5 }}>Notifications</strong>
              <button className="btn btn-ghost btn-sm" onClick={markAllNotificationsRead}>
                <CheckCheck size={14} /> Mark all read
              </button>
            </div>
            {notifications.length === 0 && (
              <div className="dropdown-item text-muted">You're all caught up</div>
            )}
            {notifications.slice(0, 8).map((n) => (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? "unread" : ""}`}
                onClick={() => markNotificationRead(n.id)}
              >
                {!n.read && <span className="notif-dot" />}
                <div>
                  <div>{n.message}</div>
                  <div className="text-muted" style={{ fontSize: 11.5, marginTop: 3 }}>
                    {formatDate(n.createdDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Dropdown>

        <Dropdown
          trigger={(toggle) => (
            <button className="user-menu-trigger" onClick={toggle}>
              <Avatar name={currentUser?.name || "User"} color={currentUser?.avatarColor} size={32} />
              <div className="user-menu-name-wrap">
                <div className="user-menu-name">{currentUser?.name || "User"}</div>
                <div className="user-menu-role">{currentUser?.role || ""}</div>
              </div>
            </button>
          )}
        >
          <div className="dropdown-item" onClick={() => navigate("/profile")}>
            <User size={15} /> My Profile
          </div>
          <div className="dropdown-item" onClick={() => navigate("/settings")}>
            <Settings size={15} /> Settings
          </div>
          <div className="dropdown-divider" />
          <div
            className="dropdown-item"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogOut size={15} /> Sign Out
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
