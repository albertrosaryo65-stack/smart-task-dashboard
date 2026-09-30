import { useState } from "react";
import StarRating from "./StarRating";

// Rating + comment form used for both task and project feedback.
export default function FeedbackForm({ initialData, onSubmit, submitLabel = "Submit Feedback" }) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }
    setError("");
    onSubmit({ rating, comment: comment.trim() });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Rating</label>
        <StarRating value={rating} onChange={setRating} />
        {error && <span className="form-error">{error}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Comments (optional)</label>
        <textarea
          className="form-input"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share what went well or what could improve..."
        />
      </div>
      <button type="submit" className="btn btn-primary btn-sm">{submitLabel}</button>
    </form>
  );
}
