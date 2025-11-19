import React, { useEffect, useState } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const [communityReviews, setCommunityReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5002/api/community-reviews')
      .then(res => res.json())
      .then(data => setCommunityReviews(data.reviews || []));
  }, []);
  useEffect(() => {
    fetch('http://localhost:5002/api/community-reviews')
      .then(res => res.json())
      .then(data => {
        setCommunityReviews(data.reviews || []);
        console.log('Fetched reviews:', data.reviews);
      });
  }, []);
  return (
    <div className="landing-root">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-content">
          <h1 className="landing-title">CraftLink</h1>
          <span className="landing-badge">Kenya</span>
          <nav className="landing-nav">
            <a href="#features">Features</a>
            <a href="#crafts">Crafts</a>
            <a href="#testimonials">Stories</a>
            <a href="/auth" className="landing-btn">Get Started</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-hero-badge">🇰🇪 Proudly Kenyan</span>
          <h2>
            Discover Authentic <span className="highlight">Kenyan Crafts</span>
          </h2>
          <p>
            Connect directly with talented Kenyan artisans and discover unique, handmade treasures. From traditional jewelry to contemporary art, find authentic crafts that tell a story.
          </p>
          <div className="landing-hero-actions">
            <a href="/auth" className="landing-btn">Start Shopping</a>
            <a href="/auth" className="landing-btn-outline">Become an Artisan</a>
          </div>
        </div>
        <div className="landing-hero-gallery">
          <img src="/images/jewellery.png" alt="Jewellery" />
          <img src="/images/baskets.png" alt="Baskets" />
          <img src="/images/ceramic cups.png" alt="Ceramic Cups" />
          <img src="/images/beaded journals.png" alt="Beaded Journals" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <h3>Why Choose CraftLink?</h3>
        <div className="features-list">
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h4>Connect Directly</h4>
            <p>Chat and call artisans directly to discuss custom orders and specifications</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h4>Authentic Crafts</h4>
            <p>Discover genuine Kenyan handmade jewelry, baskets, pottery, and traditional art</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h4>Secure Platform</h4>
            <p>Safe and secure transactions with verified artisans and quality guarantees</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h4>Global Reach</h4>
            <p>Connect Kenyan artisans with buyers worldwide, expanding market opportunities</p>
          </div>
        </div>
      </section>

      {/* Crafts Section */}
      <section id="crafts" className="landing-crafts">
        <h3>Popular Crafts</h3>
        <div className="crafts-list">
          <div className="craft-card">
            <img src="/images/jewellery.png" alt="Jewellery" />
            <h4>Jewelry</h4>
            <span>50+ Artisans</span>
          </div>
          <div className="craft-card">
            <img src="/images/baskets.png" alt="Baskets" />
            <h4>Baskets</h4>
            <span>30+ Artisans</span>
          </div>
          <div className="craft-card">
            <img src="/images/ceramic cups.png" alt="Ceramic Cups" />
            <h4>Ceramic Cups</h4>
            <span>25+ Artisans</span>
          </div>
          <div className="craft-card">
            <img src="/images/painted-canvas.jpg" alt="Painted Canvas" />
            <h4>Painted Canvas</h4>
            <span>20+ Artisans</span>
          </div>
          <div className="craft-card">
            <img src="/images/crocheted-clothes.jpg" alt="Crocheted Clothes" />
            <h4>Crocheted Clothes</h4>
            <span>35+ Artisans</span>
          </div>
          <div className="craft-card">
            <img src="/images/beaded journals.png" alt="Beaded Journals" />
            <h4>Beaded Journals</h4>
            <span>15+ Artisans</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="landing-stats">
        <div className="stat">
          <span>500+</span>
          <p>Active Artisans</p>
        </div>
        <div className="stat">
          <span>10K+</span>
          <p>Happy Customers</p>
        </div>
        <div className="stat">
          <span>50+</span>
          <p>Cities Covered</p>
        </div>
        <div className="stat">
          <span>98%</span>
          <p>Satisfaction Rate</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="landing-testimonials">
        <h3>What Our Community Says</h3>
        <div className="testimonials-list">
          {communityReviews.length === 0 ? (
            <p>No reviews yet. Be the first to share your experience!</p>
          ) : (
            communityReviews.map((review, idx) => (
              <div className="testimonial-card" key={review.id || idx}>
                <div className="testimonial-avatar">{review.name?.charAt(0) || "U"}</div>
                <div>
                  <h4>{review.name}</h4>
                  <span>
                    {review.role}
                    {review.location ? `, ${review.location}` : ""}
                  </span>
                  <p>
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                  <p>{review.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-col">
            <h4>CraftLink</h4>
            <p>
              Connecting Kenyan artisans with global buyers through authentic, handmade crafts.
            </p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#crafts">Crafts</a></li>
              <li><a href="#testimonials">Stories</a></li>
              <li><a href="/auth">Get Started</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>Email: <a href="mailto:info@craftlink.co.ke">info@craftlink.co.ke</a></p>
            <p>Phone: <a href="tel:+254700123456">+254 700 123 456</a></p>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 CraftLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;