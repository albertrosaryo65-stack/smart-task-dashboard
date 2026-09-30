import { useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

// Generic dropdown: `trigger` render prop receives a toggle function.
export default function Dropdown({ trigger, children, align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="dropdown-wrapper" ref={ref}>
      {trigger(() => setOpen((prev) => !prev), open)}
      {open && (
        <div className="dropdown-menu" style={{ [align]: 0 }} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}
