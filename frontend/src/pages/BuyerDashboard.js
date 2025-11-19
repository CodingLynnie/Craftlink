import React, { useState, useEffect } from "react";
import "./BuyerDashboard.css";
import FavoritesModal from "./FavoritesModal";
import GeneralReviewModal from "./GeneralReviewModal";
import ReviewModal from "./ReviewModal";
import { io } from "socket.io-client";
import ProfileModal from "./ProfileModal";

const API_URL = "http://localhost:5002/api/artisans"; // Adjust if needed

// Place this outside the component so it's not recreated on every render
const socket = io("http://localhost:5002", { withCredentials: true });

// Simple ChatModal component
function ChatModal({ artisan, user, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("Buyer user object:", user);
    const room = `buyer_${user.name}_seller_${artisan.name}`;
    console.log("Buyer joining room:", room);
    socket.emit("join_room", room);

    socket.on("chat_history", (msgs) => setMessages(msgs));
    socket.on("receive_message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
    };
  }, [artisan, user]);

  const sendMessage = () => {
    console.log("Buyer user object:", user);
    const room = `buyer_${user.name}_seller_${artisan.name}`;
    console.log("Buyer sending to room:", room);
    if (message.trim()) {
      socket.emit("send_message", {
        room,
        user: user.name,
        text: message,
      });
      setMessage("");
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300, maxWidth: 400 }}>
        <h2>Chat with {artisan.name}</h2>
        <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
          {messages.map((msg, idx) => (
            <div key={idx}><b>{msg.user}:</b> {msg.text}</div>
          ))}
        </div>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ width: '80%' }}
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={onClose} style={{ marginLeft: 8 }}>Close</button>
      </div>
    </div>
  );
}

function BuyerDashboard() {
  const [artisans, setArtisans] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [favorites, setFavorites] = useState(() => {
    const favs = localStorage.getItem("favorites");
    return favs ? JSON.parse(favs) : [];
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsBySeller, setProductsBySeller] = useState({});
  const [showFavorites, setShowFavorites] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatArtisan, setChatArtisan] = useState(null);
  const [combinedSearch, setCombinedSearch] = useState("");
  const [productPriceRange, setProductPriceRange] = useState([0, 10000]);
  const [showProfile, setShowProfile] = useState(false);

  // Fetch artisans with filters
  useEffect(() => {
    const fetchArtisans = async () => {
      const params = new URLSearchParams({
        search,
        location,
        minPrice,
        maxPrice,
      });
      const res = await fetch(`${API_URL}?${params.toString()}`);
      const data = await res.json();
      setArtisans(data.artisans || []);
    };
    fetchArtisans();
  }, [search, location, minPrice, maxPrice]);

  // Fetch products for each artisan
  useEffect(() => {
    const fetchProductsForArtisans = async () => {
      const newProductsBySeller = {};
      for (const artisan of artisans) {
        const res = await fetch(`http://localhost:5002/api/products?seller_id=${artisan.id}`);
        const data = await res.json();
        console.log('Fetched products for artisan', artisan.id, data);
        newProductsBySeller[artisan.id] = data.products || [];
      }
      setProductsBySeller(newProductsBySeller);
    };
    if (artisans.length > 0) {
      fetchProductsForArtisans();
    }
  }, [artisans]);

  const [showGeneralReview, setShowGeneralReview] = useState(false);

  // Handle favorite toggle
  const toggleFavorite = (artisanId) => {
    let updated;
    if (favorites.includes(artisanId)) {
      updated = favorites.filter((id) => id !== artisanId);
    } else {
      updated = [...favorites, artisanId];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Open review modal for a product
  const openReviewModal = (product) => {
    setReviewProduct(product);
    setShowReview(true);
  };

  // Submit review for a product
  const handleSubmitReview = async ({ rating, comment }) => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5002/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: reviewProduct.id,
        rating,
        comment,
      }),
    });
    setShowReview(false);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  const applyFilters = () => {
    // This function is intentionally left empty as filters auto-apply on change
    const results = artisans.filter((artisan) => {
      const matchesSearch = artisan.name.toLowerCase().includes(search.toLowerCase());  
      const matchesLocation = artisan.location.toLowerCase().includes(location.toLowerCase());
      const matchesPrice = artisan.min_price >= minPrice && artisan.min_price <= maxPrice;
      return matchesSearch && matchesLocation && matchesPrice;
    });
    setFilteredProducts(results);
  };

  // --- NEW: Filter artisans client-side for display ---
  // Robust artisan filtering
  const displayedArtisans = artisans.filter((artisan) => {
    const matchesSearch =
      artisan.name.toLowerCase().includes(combinedSearch.toLowerCase()) ||
      (productsBySeller[artisan.id] || []).some(product => product.name.toLowerCase().includes(combinedSearch.toLowerCase()));
    // Remove location filtering here; backend already filters by location
    return matchesSearch;
  });
  console.log('displayedArtisans:', displayedArtisans);

  // Build product cards and track artisans with visible products
  let productCards = [];
  let artisansWithProducts = new Set();

  displayedArtisans.forEach(artisan => {
    const products = productsBySeller[artisan.id] || [];
    products.forEach(product => {
      // Apply price filter here if needed
      const price = parseFloat(product.price);
      if (price >= productPriceRange[0] && price <= productPriceRange[1]) {
        productCards.push({ artisan, product });
        artisansWithProducts.add(artisan.id);
      }
    });
  });

  // For header count, use only artisans with products
  const visibleArtisans = artisans.filter(a => artisansWithProducts.has(a.id));
  console.log('productCards:', productCards);

  // Global product-level filtering (by combined search and price slider)
  productCards = productCards.filter(({ artisan, product }) => {
    const matchesSearch =
      artisan.name.toLowerCase().includes(combinedSearch.toLowerCase()) ||
      product.name.toLowerCase().includes(combinedSearch.toLowerCase());
    const price = parseFloat(product.price);
    const matchesProductPrice = price >= productPriceRange[0] && price <= productPriceRange[1];
    return matchesSearch && matchesProductPrice;
  });

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username || "Guest";

  // Debug: log productsBySeller state before rendering
  console.log('productsBySeller state:', productsBySeller);
  // Debug: log artisans array before filtering
  console.log('artisans:', artisans);
  // Debug: log filter values
  console.log('search:', search, 'location:', location, 'minPrice:', minPrice, 'maxPrice:', maxPrice);
  // Debug: log displayedArtisans before rendering
  console.log('displayedArtisans:', displayedArtisans);

  return (
    <div className="buyer-dashboard-root">
      {/* Header */}
      <header className="buyer-header">
        <div className="buyer-header-content">
          <div>
            <span className="buyer-logo">CraftLink</span>
            <span className="buyer-badge">Buyer</span>
          </div>
          <nav>
            <button className="buyer-header-btn" onClick={() => window.location.href = "/"}>Home</button>
            <button className="buyer-header-btn" onClick={() => setShowProfile(true)}>Profile</button>
            <button className="buyer-header-btn" onClick={() => setShowFavorites(true)}>
              Favorites ({favorites.length})
            </button>
            {/* <button className="buyer-header-btn" onClick={() => setShowGeneralReview(true)}>
              Leave Review
            </button> */}
            <span className="buyer-welcome">Welcome, User</span>
            <button className="buyer-header-btn logout" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Filters */}
      <section className="buyer-filters">
        <div className="buyer-filters-row">
          <div>
            <label>Search Artisans or Products</label>
            <input
              type="text"
              placeholder="Search by artisan or product name..."
              value={combinedSearch}
              onChange={(e) => setCombinedSearch(e.target.value)}
            />
          </div>
          {/* <div>
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{ minWidth: 120 }}
            />
          </div> */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 220 }}>
            <label>Product Price Range:</label>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ marginRight: 6, fontSize: 13, color: '#457b9d', fontWeight: 'bold' }}>Min: {productPriceRange[0]}</span>
              <input
                type="range"
                min={0}
                max={10000}
                value={productPriceRange[0]}
                onChange={e => setProductPriceRange([Number(e.target.value), productPriceRange[1]])}
                style={{ width: "120px", marginRight: 8 }}
              />
              <span style={{ marginLeft: 6, fontSize: 13, color: '#e63946', fontWeight: 'bold' }}>Max: {productPriceRange[1]}</span>
              <input
                type="range"
                min={productPriceRange[0]}
                max={10000}
                value={productPriceRange[1]}
                onChange={e => setProductPriceRange([productPriceRange[0], Number(e.target.value)])}
                style={{ width: "120px", marginLeft: 8 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Artisans Grid */}
      <section className="buyer-artisans-section">
        <div className="buyer-artisans-header">
          <h2>
            Discover Artisans ({visibleArtisans.length})
          </h2>
          <span>
            Showing {visibleArtisans.length} of {artisans.length} artisans
          </span>
        </div>
        <div className="buyer-artisans-grid">
          {productCards.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', width: '100%' }}>
              <h3>No artisans with products found for the selected filters.</h3>
              <p>Try adjusting your search, location, or price range.</p>
            </div>
          ) : (
            productCards.map(({ artisan, product }) => {
              console.log('artisan.image:', artisan.image);
              console.log('product.images:', product.images);
              return (
                <div className="buyer-artisan-card" key={product.id + '-' + artisan.id}>
                  <img
                    src={`http://localhost:5002${product.images}` || "/images/placeholder-user.jpg"}
                    alt={artisan.name}
                    className="buyer-artisan-img"
                  />
                  <button
                    className={`buyer-fav-btn ${favorites.includes(artisan.id) ? "active" : ""}`}
                    onClick={() => toggleFavorite(artisan.id)}
                    title={favorites.includes(artisan.id) ? "Remove from favorites" : "Add to favorites"}
                    style={{ position: 'absolute', top: 10, right: 10, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: favorites.includes(artisan.id) ? '#e63946' : '#333' }}
                  >
                    {favorites.includes(artisan.id) ? "♥" : "♡"}
                  </button>
                  <div className="buyer-artisan-info">
                    <h3 style={{ fontWeight: 'bold', fontSize: 20, margin: '8px 0 4px 0' }}>{artisan.name}</h3>
                    <span className="buyer-artisan-location" style={{ color: '#555', fontSize: 14, marginBottom: 4, display: 'block' }}>
                      {artisan.location}
                    </span>
                    <span className="buyer-artisan-product-name" style={{ fontWeight: 'bold', fontSize: 17, color: '#457b9d', display: 'block', marginBottom: 2 }}>
                      {product.name}
                    </span>
                    <span className="buyer-artisan-price" style={{ color: '#1d3557', fontWeight: 'bold', fontSize: 16, display: 'block', marginBottom: 8 }}>
                      KSH {product.price}
                    </span>
                    {/* Chat Button */}
                    <button
                      className="buyer-chat-btn"
                      style={{ marginTop: 8, background: '#457b9d', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer', marginRight: 8 }}
                      onClick={() => { setChatArtisan(artisan); setShowChatModal(true); }}
                    >
                      Chat
                    </button>
                    {/* <button
                      className="buyer-leave-review-btn"
                      style={{ background: '#e63946', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => openReviewModal(product)}
                    >
                      Leave Review
                    </button> */}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
      {/* Favorites Modal */}
      {showFavorites && (
        <FavoritesModal
          artisans={artisans}
          favorites={favorites}
          onClose={() => setShowFavorites(false)}
        />
      )}
      {/* Review Modal */}
      {showReview && reviewProduct && (
        <ReviewModal
          artisan={{ name: reviewProduct.name }}
          onClose={() => setShowReview(false)}
          onSubmit={handleSubmitReview}
        />
      )}
      {showGeneralReview && (
        <GeneralReviewModal
          onClose={() => setShowGeneralReview(false)}
          onSubmit={async (data) => {
            // Send to your backend (e.g., /api/app-feedback)
            await fetch("http://localhost:5002/api/app-feedback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            alert("Thank you for your feedback!");
          }}
        />
      )}
      {/* Chat Modal */}
      {showChatModal && chatArtisan && (
        <ChatModal artisan={chatArtisan} user={user} onClose={() => setShowChatModal(false)} />
      )}
      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          open={showProfile}
          onClose={() => setShowProfile(false)}
          user={user}
          products={[]}
          orders={[]}
        />
      )}
    </div>
  );
}

export default BuyerDashboard;