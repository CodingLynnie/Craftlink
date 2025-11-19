import React, { useState } from "react";
import "./ReviewModal.css";

function ReviewModal({ artisan, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ rating, comment });
    setLoading(false);
    onClose();
  };

  return (
    <div className="review-modal-backdrop" onClick={onClose}>
      <div className="review-modal" onClick={e => e.stopPropagation()}>
        <h2>Leave a Review for {artisan.name}</h2>
        <button className="review-modal-close" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit}>
          <label>Rating:</label>
          <div className="review-stars">
            {[1,2,3,4,5].map(num => (
              <span
                key={num}
                className={num <= rating ? "star filled" : "star"}
                onClick={() => setRating(num)}
                role="button"
                tabIndex={0}
              >★</span>
            ))}
          </div>
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
            placeholder="Write your review..."
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;