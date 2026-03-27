import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome to FreshMart, ${res.data.user.name}! 🎉`);
      navigate('/shop');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({...form, [field]: e.target.value});

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-brand"><span>🛒</span><span>FreshMart</span></div>
        <h2>Join FreshMart Today!</h2>
        <p>Create your account and enjoy fresh groceries delivered to your door every day.</p>
        <div className="auth-perks">
          <div className="perk"><div className="perk-icon">🎁</div><span>Free first delivery</span></div>
          <div className="perk"><div className="perk-icon">💸</div><span>Auto 10% discount on ₹2000+</span></div>
          <div className="perk"><div className="perk-icon">📦</div><span>Track orders in real time</span></div>
          <div className="perk"><div className="perk-icon">🥗</div><span>500+ fresh products</span></div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-box">
          <h2>Create Account</h2>
          <p>Fill in your details to get started</p>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Priya Sharma" value={form.name} onChange={set('name')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="9876543210" value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <input className="form-input" placeholder="Your full address" value={form.address} onChange={set('address')} />
            </div>
            <div className="auth-submit">
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? '⏳ Creating Account...' : '🎉 Create Account'}
              </button>
            </div>
          </form>
          <div className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
