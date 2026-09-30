import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <AlertTriangle size={24} />
      </div>
      <div className="empty-state-title">Page not found</div>
      <p className="text-sm">The page you're looking for doesn't exist.</p>
      <button className="btn btn-primary btn-sm mt-16" onClick={() => navigate("/")}>
        Go to Dashboard
      </button>
    </div>
  );
}
