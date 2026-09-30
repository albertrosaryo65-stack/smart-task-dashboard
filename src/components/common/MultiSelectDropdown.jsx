import { useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";

// Checklist-style multi-select filter. Stays open while checking/unchecking
// options (unlike the generic Dropdown, which closes on any inner click).
export default function MultiSelectDropdown({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  function toggleOption(value) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  const buttonLabel =
    selected.length === 0
      ? `All ${label}`
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label || selected[0]
        : `${selected.length} ${label} selected`;

  return (
    <div className="dropdown-wrapper" ref={ref}>
      <button
        type="button"
        className={`filter-select multiselect-trigger ${selected.length > 0 ? "has-selection" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{buttonLabel}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="dropdown-menu multiselect-menu">
          {selected.length > 0 && (
            <div className="dropdown-item multiselect-clear" onClick={() => onChange([])}>
              Clear selection
            </div>
          )}
          {options.map((option) => {
            const isChecked = selected.includes(option.value);
            return (
              <label key={option.value} className="multiselect-option">
                <span className={`multiselect-checkbox ${isChecked ? "checked" : ""}`}>
                  {isChecked && <Check size={12} />}
                </span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleOption(option.value)}
                  style={{ display: "none" }}
                />
                {option.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
