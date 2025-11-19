import React, { useState } from "react";
import "./GeneralReviewModal.css";

function GeneralReviewModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ name, role, location, rating, comment });
    setLoading(false);
    onClose();
  };
  
  // The problematic recursive rendering block has been removed from here.

  return (
    <div className="review-modal-backdrop" onClick={onClose}>
      <div className="review-modal" onClick={e => e.stopPropagation()}>
        <h2>Share Your Experience</h2>
        <button className="review-modal-close" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit}>
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <label>You are a</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          >
            <option value="">Select your role</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="artisan">Artisan</option>
            <option value="other">Other</option>
          </select>
          <label>Location</label>
          <input
            type="text"
            placeholder="e.g., New York, USA or Nairobi, Kenya"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
          <label>Rating</label>
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
          <label>Your Review</label>
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

export default GeneralReviewModal;