import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems, cartTotal, discount, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [form, setForm] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    email: user?.email || '',
  });

  const set = f => e => setForm({...form, [f]: e.target.value});

  const handlePlaceOrder = async () => {
    if (!form.customerName || !form.phone || !form.address) {
      toast.error('Please fill all required fields');
      return;
    }
    setPlacing(true);
    try {
      const items = cartItems.map(item => ({ productId: item.productId, quantity: item.quantity }));
      const res = await orderAPI.place({ ...form, items, paymentMethod });
      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${res.data.order.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="page-container">
        <div className="checkout-header">
          <h1>🏠 Checkout</h1>
          <p>Almost there! Fill in your delivery details.</p>
        </div>

        <div className="checkout-layout">
          <div className="checkout-form">
            <div className="form-section">
              <h2>📦 Delivery Details</h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={form.customerName} onChange={set('customerName')} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input className="form-input" value={form.phone} onChange={set('phone')} placeholder="10-digit phone" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea className="form-input form-textarea" value={form.address} onChange={set('address')} placeholder="Full address with pincode" rows={3} />
              </div>
            </div>

            <div className="form-section">
              <h2>💳 Payment Method</h2>
              <div className="payment-options">
                {[
                  { key: 'COD', label: '💵 Cash on Delivery', desc: 'Pay when delivered' },
                  { key: 'UPI', label: '📱 UPI Payment', desc: 'Google Pay, PhonePe, Paytm' },
                  { key: 'Card', label: '💳 Debit/Credit Card', desc: 'Visa, Mastercard, Rupay' },
                ].map(pm => (
                  <div key={pm.key}
                    className={`payment-option ${paymentMethod === pm.key ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(pm.key)}>
                    <div className="payment-radio">{paymentMethod === pm.key ? '●' : '○'}</div>
                    <div>
                      <div className="pay-label">{pm.label}</div>
                      <div className="pay-desc">{pm.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="delivery-slot-card">
              <div className="slot-icon">🚚</div>
              <div>
                <div className="slot-title">Today's Delivery Slot</div>
                <div className="slot-time">5:00 PM – 7:00 PM (Evening)</div>
              </div>
              <div className="slot-badge">FREE</div>
            </div>
          </div>

          <div className="checkout-summary">
            <div className="summary-card">
              <h2>🧾 Order Summary</h2>
              <div className="order-items-list">
                {cartItems.map(item => (
                  <div key={item.cartId} className="order-item-row">
                    <span className="order-item-name">{item.name} × {item.quantity}</span>
                    <span>₹{item.subtotal.toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider" />
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Items Total</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row" style={{color:'var(--green)'}}>
                    <span>🎉 10% Discount</span>
                    <span>−₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Delivery</span>
                  <span style={{color:'var(--green)', fontWeight:700}}>FREE</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row" style={{fontWeight:900, fontSize:'1.1rem', color:'#111827'}}>
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              {discount > 0 && (
                <div className="checkout-discount-note">
                  🎉 You're saving ₹{discount.toFixed(0)} on this order!
                </div>
              )}

              <button className="btn btn-primary btn-full btn-lg"
                onClick={handlePlaceOrder} disabled={placing}>
                {placing ? '⏳ Placing Order...' : `🎉 Place Order • ₹${finalTotal.toFixed(0)}`}
              </button>

              <p className="checkout-note">
                By placing the order, you agree to our delivery terms. Payment is {paymentMethod === 'COD' ? 'collected at doorstep' : 'processed securely'}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
