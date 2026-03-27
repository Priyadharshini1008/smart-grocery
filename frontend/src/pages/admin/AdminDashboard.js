import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { orderAPI, productAPI, adminAPI } from '../../services/api';
import './AdminDashboard.css';

const STATUS_COLORS = { 'Processing':'orange', 'Confirmed':'blue', 'Out for Delivery':'purple', 'Delivered':'green' };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [todayOrders, setTodayOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    Promise.all([
      orderAPI.getStats(),
      orderAPI.getToday(),
    ]).then(([statsRes, ordersRes]) => {
      setStats(statsRes.data);
      setTodayOrders(ordersRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdatingStatus(p => ({...p, [orderId]: true}));
    try {
      await orderAPI.updateStatus(orderId, status);
      setTodayOrders(prev => prev.map(o => o.id === orderId ? {...o, deliveryStatus: status} : o));
    } finally {
      setUpdatingStatus(p => ({...p, [orderId]: false}));
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="page-container">
        <div className="admin-header">
          <div>
            <h1>📊 Dashboard</h1>
            <p>Today's overview — {new Date().toLocaleDateString('en-IN', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card green">
                <div className="stat-icon">🛒</div>
                <div className="stat-info">
                  <div className="stat-value">{stats?.todayOrders || 0}</div>
                  <div className="stat-label">Today's Orders</div>
                </div>
              </div>
              <div className="stat-card orange">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-value">₹{stats?.todaySales?.toFixed(0) || 0}</div>
                  <div className="stat-label">Today's Revenue</div>
                </div>
              </div>
              <div className="stat-card purple">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <div className="stat-value">{stats?.totalOrders || 0}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
              </div>
              <div className="stat-card blue">
                <div className="stat-icon">💎</div>
                <div className="stat-info">
                  <div className="stat-value">₹{stats?.totalSales?.toFixed(0) || 0}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
              </div>
            </div>

            <div className="today-orders-section">
              <h2>📋 Today's Orders</h2>
              {todayOrders.length === 0 ? (
                <div className="no-orders">No orders today yet</div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayOrders.map(order => (
                        <tr key={order.id}>
                          <td className="order-id-cell">#{order.id?.slice(-6).toUpperCase()}</td>
                          <td>
                            <div className="customer-cell">
                              <div className="cust-avatar">{order.customerName?.charAt(0)}</div>
                              <div>
                                <div className="cust-name">{order.customerName}</div>
                                <div className="cust-addr">{order.address?.substring(0, 30)}...</div>
                              </div>
                            </div>
                          </td>
                          <td>{order.phone}</td>
                          <td><span className="items-count">{order.items?.length} items</span></td>
                          <td><span className="amount-cell">₹{order.finalPrice?.toFixed(0)}</span></td>
                          <td><span className={`badge badge-${order.paymentStatus === 'Paid' ? 'green' : 'orange'}`}>{order.paymentMethod}</span></td>
                          <td><span className={`badge badge-${STATUS_COLORS[order.deliveryStatus] || 'orange'}`}>{order.deliveryStatus}</span></td>
                          <td>
                            <select
                              className="status-select"
                              value={order.deliveryStatus}
                              onChange={e => updateStatus(order.id, e.target.value)}
                              disabled={updatingStatus[order.id]}>
                              <option>Processing</option>
                              <option>Confirmed</option>
                              <option>Out for Delivery</option>
                              <option>Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
