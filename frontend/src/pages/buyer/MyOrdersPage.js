import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { orderAPI } from '../../services/api';
import './MyOrdersPage.css';

const STATUS_COLORS = {
  'Processing': 'orange',
  'Confirmed': 'blue',
  'Out for Delivery': 'purple',
  'Delivered': 'green',
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orderAPI.myOrders().then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="orders-page">
      <Navbar />
      <div className="page-container">
        <div className="orders-header">
          <h1>📦 My Orders</h1>
          <p>{orders.length} orders placed</p>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping and your orders will appear here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="order-meta">
                    <div className="order-id">#{order.id?.slice(-8).toUpperCase()}</div>
                    <div className="order-date">📅 {order.orderDate}</div>
                  </div>
                  <div className="order-status-price">
                    <span className={`badge badge-${STATUS_COLORS[order.deliveryStatus] || 'orange'}`}>
                      {order.deliveryStatus}
                    </span>
                    <span className="order-amount">₹{order.finalPrice?.toFixed(0)}</span>
                    <span className="expand-icon">{expanded === order.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="order-details">
                    <div className="order-track">
                      {['Processing','Confirmed','Out for Delivery','Delivered'].map((step, i) => {
                        const statuses = ['Processing','Confirmed','Out for Delivery','Delivered'];
                        const currentIdx = statuses.indexOf(order.deliveryStatus);
                        const stepIdx = statuses.indexOf(step);
                        return (
                          <div key={step} className={`track-step ${stepIdx <= currentIdx ? 'done' : ''}`}>
                            <div className="track-dot" />
                            <span>{step}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="order-items-grid">
                      {order.items?.map((item, i) => (
                        <div key={i} className="order-detail-item">
                          <span className="odi-name">{item.productName}</span>
                          <span className="odi-qty">× {item.quantity}</span>
                          <span className="odi-price">₹{item.subtotal?.toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-summary-mini">
                      {order.discount > 0 && (
                        <div className="osm-row green">🎉 Discount: −₹{order.discount?.toFixed(0)}</div>
                      )}
                      <div className="osm-row total">Total: ₹{order.finalPrice?.toFixed(0)}</div>
                      <div className="osm-row">📍 {order.address}</div>
                      <div className="osm-row">💳 {order.paymentMethod} · {order.paymentStatus}</div>
                    </div>

                    {order.deliveryStatus === 'Delivered' && (
                      <div className="delivered-banner">
                        ✅ Delivered successfully! We hope you enjoyed your groceries 🥗
                      </div>
                    )}
                    {order.deliveryStatus !== 'Delivered' && (
                      <div className="delivery-eta-banner">
                        🚚 Estimated delivery today between <strong>5 PM – 7 PM</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
