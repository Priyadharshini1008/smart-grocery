import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { orderAPI } from '../../services/api';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderAPI.getById(orderId).then(res => setOrder(res.data)).catch(() => {});
  }, [orderId]);

  return (
    <div className="success-page">
      <Navbar />
      <div className="success-container">
        <div className="success-card">
          <div className="success-animation">
            <div className="success-circle">✅</div>
          </div>
          <h1>Order Successful! 🎉</h1>
          <p className="success-subtitle">Your groceries are on their way!</p>

          <div className="delivery-message-box">
            <div className="dm-icon">🚚</div>
            <div className="dm-text">
              <strong>Your groceries will be delivered today evening</strong>
              <span>Door delivery between 5 PM – 7 PM</span>
            </div>
          </div>

          {order && (
            <div className="order-details-mini">
              <div className="odm-row"><span>Order ID</span><span className="odm-val">#{order.id?.slice(-8).toUpperCase()}</span></div>
              <div className="odm-row"><span>Items</span><span className="odm-val">{order.items?.length} items</span></div>
              {order.discount > 0 && (
                <div className="odm-row discount"><span>🎉 Discount Saved</span><span className="odm-val">₹{order.discount?.toFixed(0)}</span></div>
              )}
              <div className="odm-row total"><span>Total Paid</span><span className="odm-val">₹{order.finalPrice?.toFixed(0)}</span></div>
              <div className="odm-row"><span>Payment</span><span className="odm-val">{order.paymentMethod}</span></div>
              <div className="odm-row"><span>Delivery to</span><span className="odm-val addr">{order.address}</span></div>
            </div>
          )}

          <div className="success-actions">
            <Link to="/my-orders" className="btn btn-primary btn-lg">📦 Track Order</Link>
            <Link to="/shop" className="btn btn-outline btn-lg">🛍️ Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
