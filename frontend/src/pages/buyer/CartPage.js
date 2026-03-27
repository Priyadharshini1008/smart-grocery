import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cartItems, cartTotal, discount, finalTotal, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="page-container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some fresh groceries to get started!</p>
            <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping 🛍️</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />
      <div className="page-container">
        <div className="cart-header">
          <h1>🛒 Your Cart <span className="cart-count-badge">{cartItems.length} items</span></h1>
          <Link to="/shop" className="btn btn-outline btn-sm">← Continue Shopping</Link>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.cartId} className="cart-item">
                <div className="cart-item-img">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="cart-img-placeholder">🛒</div>
                  )}
                </div>
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-unit">{item.unit}</p>
                  <span className="cart-item-price">₹{item.price}</span>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-ctrl">
                    <button onClick={() => updateItem(item.cartId, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateItem(item.cartId, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-subtotal">₹{item.subtotal.toFixed(0)}</span>
                  <button className="remove-btn" onClick={() => removeItem(item.cartId)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>

              {cartTotal > 2000 && (
                <div className="discount-alert">
                  🎉 You saved ₹{discount.toFixed(0)} with 10% discount!
                </div>
              )}

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount-row">
                    <span>🎉 10% Discount</span>
                    <span>−₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Delivery</span>
                  <span className="free-delivery">FREE 🚚</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              {cartTotal > 2000 ? (
                <div className="discount-applied">✅ 10% discount applied!</div>
              ) : (
                <div className="discount-progress">
                  <span>Add ₹{(2000 - cartTotal).toFixed(0)} more for 10% off</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${Math.min((cartTotal/2000)*100, 100)}%`}} />
                  </div>
                </div>
              )}

              <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/checkout')}>
                Proceed to Checkout →
              </button>

              <div className="delivery-info">
                🚚 Delivery between <strong>5 PM – 7 PM</strong> today
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
