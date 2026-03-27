import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      navigate(res.data.user.role === 'ADMIN' ? '/admin' : '/shop');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-brand"><span>🛒</span><span>FreshMart</span></div>
        <h2>Welcome Back!</h2>
        <p>Your fresh groceries are waiting. Log in to continue shopping.</p>
        <div className="auth-perks">
          <div className="perk"><div className="perk-icon">🚚</div><span>Same-day delivery</span></div>
          <div className="perk"><div className="perk-icon">💸</div><span>10% off orders over ₹2000</span></div>
          <div className="perk"><div className="perk-icon">🥦</div><span>100% fresh produce</span></div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-box">
          <h2>Login to FreshMart</h2>
          <p>Enter your credentials to access your account</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@email.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Your password"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <div className="auth-submit">
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? '⏳ Logging in...' : '🚀 Login'}
              </button>
            </div>
          </form>
          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
          <div className="auth-footer" style={{marginTop: 8}}>
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
