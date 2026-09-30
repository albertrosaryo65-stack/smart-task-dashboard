import { useState, useEffect } from "react";

// Debounces a fast-changing value (e.g. search input) so expensive
// filtering only runs after the user pauses typing.
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
