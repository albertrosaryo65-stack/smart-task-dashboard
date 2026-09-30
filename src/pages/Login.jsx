import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { CheckSquare, LogIn } from "lucide-react";
import { useApp } from "../context/AppContext";
import PasswordInput from "../components/common/PasswordInput";

export default function Login() {
  const { currentUser, login } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (currentUser) {
    const redirectTo = location.state?.from || "/";
    return <Navigate to={redirectTo} replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    if (!cleanEmail || !cleanPassword) {
      setError("Enter both email and password.");
      return;
    }
    const user = login(cleanEmail, cleanPassword);
    if (!user) {
      setError("Invalid email or password. Please check your credentials or use 'password123' if using the default password.");
      return;
    }
    navigate(location.state?.from || "/", { replace: true });
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">
            <CheckSquare size={22} />
          </div>
          <span className="brand-name">Smart Task</span>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to continue to your dashboard.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-input ${error ? "has-error" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. albertrosaryo65@gmail.com"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <PasswordInput
              inputClassName={error ? "has-error" : ""}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="form-error mb-16">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block">
            <LogIn size={16} /> Sign In
          </button>
        </form>

        <div className="login-demo-hint">
          <div className="text-sm text-muted" style={{ fontWeight: 600, marginBottom: 4 }}>
            Demo / Default credentials
          </div>
          <div className="text-sm text-muted">albertrosaryo65@gmail.com / password123</div>
          <div className="text-sm text-muted mt-8" style={{ fontSize: 12 }}>
            💡 Newly added team members can sign in with their registered email and chosen password (default: <code>password123</code>).
          </div>
        </div>
      </div>
    </div>
  );
}
