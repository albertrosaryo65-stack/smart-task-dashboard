import { Star } from "lucide-react";

// Interactive (or read-only) 1-5 star rating control.
export default function StarRating({ value = 0, onChange, readOnly = false, size = 20 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating" role={readOnly ? undefined : "radiogroup"} aria-label="Rating">
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= value ? "filled" : ""}`}
          onClick={readOnly ? undefined : () => onChange(n)}
          disabled={readOnly}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star size={size} fill={n <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}
