import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './AdminOrders.css';

const STATUS_COLORS = { 'Processing':'orange', 'Confirmed':'blue', 'Out for Delivery':'purple', 'Delivered':'green' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orderAPI.getAll().then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    await orderAPI.updateStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? {...o, deliveryStatus: status} : o));
    toast.success('Status updated!');
  };

  const statuses = ['All','Processing','Confirmed','Out for Delivery','Delivered'];
  const filtered = filter === 'All' ? orders : orders.filter(o => o.deliveryStatus === filter);

  return (
    <div className="admin-page">
      <Navbar />
      <div className="page-container">
        <div className="admin-header">
          <div>
            <h1>📦 All Orders</h1>
            <p>{orders.length} total orders</p>
          </div>
        </div>

        <div className="orders-filter-tabs">
          {statuses.map(s => (
            <button key={s} className={`cat-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s} {s !== 'All' && <span className="tab-count">{orders.filter(o=>o.deliveryStatus===s).length}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <div className="orders-accordion">
            {filtered.length === 0 && (
              <div className="no-orders-msg">No orders in this category</div>
            )}
            {filtered.map(order => (
              <div key={order.id} className="ao-card">
                <div className="ao-row" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="ao-left">
                    <div className="cust-avatar">{order.customerName?.charAt(0)}</div>
                    <div>
                      <div className="ao-customer">{order.customerName}</div>
                      <div className="ao-date">{order.orderDate} · {order.phone}</div>
                    </div>
                  </div>
                  <div className="ao-right">
                    <span className={`badge badge-${STATUS_COLORS[order.deliveryStatus] || 'orange'}`}>{order.deliveryStatus}</span>
                    <span className="ao-amount">₹{order.finalPrice?.toFixed(0)}</span>
                    <span className="expand-icon">{expanded === order.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="ao-details">
                    <div className="ao-detail-grid">
                      <div className="ao-section">
                        <h4>📦 Items ({order.items?.length})</h4>
                        {order.items?.map((item, i) => (
                          <div key={i} className="ao-item-row">
                            <span>{item.productName} × {item.quantity}</span>
                            <span>₹{item.subtotal?.toFixed(0)}</span>
                          </div>
                        ))}
                        {order.discount > 0 && (
                          <div className="ao-item-row green">
                            <span>🎉 10% Discount</span>
                            <span>−₹{order.discount?.toFixed(0)}</span>
                          </div>
                        )}
                        <div className="ao-item-row total">
                          <span>Total</span>
                          <span>₹{order.finalPrice?.toFixed(0)}</span>
                        </div>
                      </div>
                      <div className="ao-section">
                        <h4>📍 Customer Info</h4>
                        <div className="ao-info-row"><span>Name</span><span>{order.customerName}</span></div>
                        <div className="ao-info-row"><span>Phone</span><span>{order.phone}</span></div>
                        <div className="ao-info-row"><span>Address</span><span>{order.address}</span></div>
                        <div className="ao-info-row"><span>Payment</span><span>{order.paymentMethod} · {order.paymentStatus}</span></div>
                      </div>
                    </div>
                    <div className="ao-status-control">
                      <label>Update Status:</label>
                      <select className="status-select" value={order.deliveryStatus}
                        onChange={e => updateStatus(order.id, e.target.value)}>
                        <option>Processing</option>
                        <option>Confirmed</option>
                        <option>Out for Delivery</option>
                        <option>Delivered</option>
                      </select>
                    </div>
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
