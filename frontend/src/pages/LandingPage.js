import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const features = [
    { icon: '🥦', title: 'Fresh Veggies', desc: 'Farm-fresh produce delivered daily' },
    { icon: '🚚', title: 'Fast Delivery', desc: 'Same-day delivery at your door' },
    { icon: '💰', title: 'Best Prices', desc: 'Auto discounts on orders over ₹2000' },
    { icon: '📱', title: 'Easy Ordering', desc: 'Order in minutes, track in real time' },
  ];
  const categories = ['🍎 Fruits','🥕 Vegetables','🥛 Dairy','🍞 Bakery','🥤 Beverages','🍫 Snacks','🥩 Meat','🧊 Frozen'];
  return (
    <div className="landing">
      <nav className="land-nav">
        <div className="land-nav-inner">
          <div className="brand-wrap">
            <span className="land-icon">🛒</span>
            <span className="land-brand">FreshMart</span>
          </div>
          <div className="land-nav-links">
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🌿 Fresh • Organic • Fast</div>
          <h1>Groceries Delivered <span className="hero-highlight">Fresh</span> to Your Door</h1>
          <p>Order fresh produce, dairy, snacks and more. Get same-day delivery with automatic discounts on big orders!</p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Start Shopping 🛍️</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Login →</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span>1000+</span><label>Products</label></div>
            <div className="stat-divider" />
            <div className="stat"><span>10k+</span><label>Happy Customers</label></div>
            <div className="stat-divider" />
            <div className="stat"><span>5PM-7PM</span><label>Delivery Window</label></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card1">🥑 Avocado<br/><small>₹89/pc</small></div>
          <div className="floating-card card2">🍓 Strawberry<br/><small>₹149/pack</small></div>
          <div className="floating-card card3">🥛 Fresh Milk<br/><small>₹62/litre</small></div>
          <div className="hero-circle">
            <span className="hero-emoji">🛒</span>
          </div>
        </div>
      </section>

      <section className="categories-strip">
        {categories.map((cat, i) => (
          <div key={i} className="cat-pill">{cat}</div>
        ))}
      </section>

      <section className="features-section">
        <h2>Why Choose <span>FreshMart?</span></h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="discount-banner">
        <div className="discount-inner">
          <div className="discount-text">
            <h2>🎉 Automatic Discount!</h2>
            <p>Get <strong>10% OFF</strong> on orders above <strong>₹2000</strong> — no coupon needed!</p>
          </div>
          <Link to="/register" className="btn btn-primary btn-lg">Claim Now →</Link>
        </div>
      </section>

      <footer className="land-footer">
        <div className="land-brand">🛒 FreshMart</div>
        <p>Fresh groceries at your fingertips. © 2024 FreshMart</p>
      </footer>
    </div>
  );
}
