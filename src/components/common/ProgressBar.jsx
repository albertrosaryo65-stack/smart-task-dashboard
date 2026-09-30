// Simple progress bar. Color shifts based on completion percentage.
export default function ProgressBar({ value = 0 }) {
  const clamped = Math.min(100, Math.max(0, value));
  let colorClass = "";
  if (clamped >= 100) colorClass = "success";
  else if (clamped < 30) colorClass = "danger";
  else if (clamped < 70) colorClass = "warning";

  return (
    <div className="progress-track">
      <div
        className={`progress-fill ${colorClass}`}
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
