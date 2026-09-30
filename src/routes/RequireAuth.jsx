import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Loading from "../components/common/Loading";

// Redirects to /login when no user is signed in.
export default function RequireAuth() {
  const { currentUser, isLoading } = useApp();
  const location = useLocation();

  if (isLoading) return <Loading />;
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
}
