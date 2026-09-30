import { useEffect } from "react";

// Calls `onOutsideClick` when a click happens outside of `ref`.
// Used to close dropdowns, modals and popovers.
export function useClickOutside(ref, onOutsideClick) {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onOutsideClick]);
}
