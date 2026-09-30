import { ChevronRight } from "lucide-react";

// Single summary statistic card used on the Dashboard page.
// When `onClick` is passed the card becomes a drill-down button.
export default function StatCard({ icon: Icon, label, value, trend, trendPositive, color, onClick }) {
  const isClickable = typeof onClick === "function";

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  }

  return (
    <div
      className={`card stat-card ${isClickable ? "stat-card-clickable" : ""}`}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `View details for ${label}` : undefined}
    >
      <div className="stat-card-top">
        <div className="stat-icon" style={{ backgroundColor: `${color}1a`, color }}>
          <Icon size={20} />
        </div>
        {isClickable && (
          <span className="stat-drill-hint">
            View details <ChevronRight size={14} />
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && <div className={`stat-trend ${trendPositive ? "positive" : ""}`}>{trend}</div>}
    </div>
  );
}
