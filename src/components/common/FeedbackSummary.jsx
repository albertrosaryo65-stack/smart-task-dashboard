import StarRating from "./StarRating";
import { formatDate } from "../../utils/helpers";

// Read-only rendering of a submitted feedback entry.
export default function FeedbackSummary({ feedback, authorName }) {
  if (!feedback) return null;
  return (
    <div className="feedback-summary">
      <div className="flex-between">
        <StarRating value={feedback.rating} readOnly size={16} />
        <span className="text-sm text-muted">{formatDate(feedback.date)}</span>
      </div>
      {feedback.comment && <p className="text-sm mt-8">{feedback.comment}</p>}
      {authorName && <div className="text-sm text-muted mt-8">— {authorName}</div>}
    </div>
  );
}
