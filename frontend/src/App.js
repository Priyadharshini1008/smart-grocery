import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/buyer/ShopPage';
import CartPage from './pages/buyer/CartPage';
import CheckoutPage from './pages/buyer/CheckoutPage';
import OrderSuccessPage from './pages/buyer/OrderSuccessPage';
import MyOrdersPage from './pages/buyer/MyOrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Buyer Routes */}
      <Route path="/shop" element={<ProtectedRoute role="BUYER"><ShopPage /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute role="BUYER"><CartPage /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute role="BUYER"><CheckoutPage /></ProtectedRoute>} />
      <Route path="/order-success/:orderId" element={<ProtectedRoute role="BUYER"><OrderSuccessPage /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute role="BUYER"><MyOrdersPage /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute role="ADMIN"><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute role="ADMIN"><AdminCustomers /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: 'Nunito, sans-serif',
                fontWeight: '600',
                borderRadius: '12px',
                padding: '14px 18px',
              },
              success: { iconTheme: { primary: '#22C55E', secondary: 'white' } },
              error: { iconTheme: { primary: '#EF4444', secondary: 'white' } },
            }}
          />
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
