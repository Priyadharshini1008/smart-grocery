import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={isAdmin() ? '/admin' : '/shop'} className="navbar-brand">
          <span className="brand-icon">🛒</span>
          <span className="brand-text">FreshMart</span>
        </Link>

        {!isAdmin() && (
          <div className="navbar-search-wrap">
            <div className="navbar-links">
              <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Shop</Link>
              <Link to="/my-orders" className={location.pathname === '/my-orders' ? 'active' : ''}>My Orders</Link>
            </div>
          </div>
        )}

        {isAdmin() && (
          <div className="navbar-links">
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Dashboard</Link>
            <Link to="/admin/products" className={location.pathname === '/admin/products' ? 'active' : ''}>Products</Link>
            <Link to="/admin/orders" className={location.pathname === '/admin/orders' ? 'active' : ''}>Orders</Link>
            <Link to="/admin/customers" className={location.pathname === '/admin/customers' ? 'active' : ''}>Customers</Link>
          </div>
        )}

        <div className="navbar-right">
          {!isAdmin() && (
            <Link to="/cart" className="cart-btn">
              <span>🛍️</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}
          <div className="user-menu">
            <button className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="avatar-circle">{user.name?.charAt(0).toUpperCase()}</span>
              <span className="user-name">{user.name?.split(' ')[0]}</span>
              <span>▾</span>
            </button>
            {menuOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <span className="drop-name">{user.name}</span>
                  <span className="drop-role">{user.role}</span>
                </div>
                <button onClick={handleLogout} className="drop-logout">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
