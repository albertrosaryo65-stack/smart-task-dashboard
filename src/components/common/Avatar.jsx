import { getInitials } from "../../utils/helpers";

// Circular avatar showing a user's initials on a colored background.
export default function Avatar({ name, color = "#2563eb", size = 34 }) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
