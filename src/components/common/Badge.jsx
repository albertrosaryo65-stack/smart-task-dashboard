import { STATUS_COLORS, PRIORITY_COLORS } from "../../utils/constants";

// Generic color-coded badge for statuses, priorities and tags.
export default function Badge({ label, variant }) {
  const colorClass =
    variant || STATUS_COLORS[label] || PRIORITY_COLORS[label] || "badge-gray";
  return <span className={`badge ${colorClass}`}>{label}</span>;
}
