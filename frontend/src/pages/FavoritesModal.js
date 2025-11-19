import React from "react";
import "./FavoritesModal.css";

function FavoritesModal({ artisans, favorites, onClose }) {
  // Filter only favorite artisans
  const favoriteArtisans = artisans.filter(a => favorites.includes(a.id));
   
  return (
    <div className="favorites-modal-backdrop" onClick={onClose}>
      <div className="favorites-modal" onClick={e => e.stopPropagation()}>
        <h2>Your Favorites</h2>
        <button className="favorites-modal-close" onClick={onClose}>×</button>
        {favoriteArtisans.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <div className="favorites-list">
            {favoriteArtisans.map(artisan => (
              <div className="favorites-artisan-card" key={artisan.id}>
                <img src={artisan.image || "/images/placeholder-user.jpg"} alt={artisan.name} />
                <div>
                  <h4>{artisan.name}</h4>
                  <span>{artisan.location}</span>
                  <span>Starting at KSH {artisan.min_price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesModal;