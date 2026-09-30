import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Password input with a show/hide toggle icon.
export default function PasswordInput({ className = "", inputClassName = "", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`password-input-wrap ${className}`}>
      <input {...props} type={visible ? "text" : "password"} className={`form-input ${inputClassName}`} />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
