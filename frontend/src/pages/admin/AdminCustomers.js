import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { adminAPI, orderAPI } from '../../services/api';
import './AdminCustomers.css';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([adminAPI.getCustomers(), orderAPI.getAll()]).then(([custRes, ordRes]) => {
      setCustomers(custRes.data);
      setOrders(ordRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const getCustomerOrders = (userId) => orders.filter(o => o.userId === userId);
  const getCustomerSpend = (userId) => getCustomerOrders(userId).reduce((sum, o) => sum + o.finalPrice, 0);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="admin-page">
      <Navbar />
      <div className="page-container">
        <div className="admin-header">
          <div>
            <h1>👥 Customers</h1>
            <p>{customers.length} registered customers</p>
          </div>
        </div>

        <div className="cust-search-wrap">
          <input className="filter-search" placeholder="🔍 Search by name, email or phone..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <div className="customers-grid">
            {filtered.map(cust => {
              const custOrders = getCustomerOrders(cust.id);
              const spend = getCustomerSpend(cust.id);
              return (
                <div key={cust.id} className="cust-card">
                  <div className="cust-card-header">
                    <div className="cust-big-avatar">{cust.name?.charAt(0).toUpperCase()}</div>
                    <div className="cust-main-info">
                      <h3>{cust.name}</h3>
                      <div className="cust-email">{cust.email}</div>
                    </div>
                  </div>
                  <div className="cust-details">
                    {cust.phone && <div className="cust-detail-row">📞 {cust.phone}</div>}
                    {cust.address && <div className="cust-detail-row">📍 {cust.address}</div>}
                  </div>
                  <div className="cust-stats">
                    <div className="cust-stat">
                      <span>{custOrders.length}</span>
                      <label>Orders</label>
                    </div>
                    <div className="cust-stat-divider" />
                    <div className="cust-stat">
                      <span>₹{spend.toFixed(0)}</span>
                      <label>Total Spent</label>
                    </div>
                    <div className="cust-stat-divider" />
                    <div className="cust-stat">
                      <span>{custOrders.filter(o => o.deliveryStatus === 'Delivered').length}</span>
                      <label>Delivered</label>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{gridColumn:'1/-1', textAlign:'center', padding:'60px', color:'var(--gray-400)', fontWeight:600}}>
                No customers found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
