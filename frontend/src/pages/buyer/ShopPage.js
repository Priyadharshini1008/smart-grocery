import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './ShopPage.css';

const CATEGORIES = ['All','Fruits','Vegetables','Dairy','Bakery','Beverages','Snacks','Meat','Frozen'];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== 'All') result = result.filter(p => p.category === category);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [products, category, search]);

  const loadProducts = async () => {
    try {
      const res = await productAPI.getAll();
      setProducts(res.data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const handleAdd = async (productId) => {
    setAdding(prev => ({...prev, [productId]: true}));
    try {
      await addToCart(productId);
      toast.success('Added to cart! 🛍️');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error adding item');
    } finally {
      setAdding(prev => ({...prev, [productId]: false}));
    }
  };

  const catIcons = { Fruits:'🍎', Vegetables:'🥕', Dairy:'🥛', Bakery:'🍞', Beverages:'🥤', Snacks:'🍫', Meat:'🥩', Frozen:'🧊', All:'🛒' };

  return (
    <div className="shop-page">
      <Navbar />
      <div className="shop-hero">
        <div className="shop-hero-inner">
          <h1>Hello, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>What fresh items do you need today?</p>
          <div className="shop-search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search fruits, veggies, dairy..." value={search}
              onChange={e => setSearch(e.target.value)} className="search-input" />
            {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
        </div>
      </div>

      <div className="shop-body page-container">
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button key={cat}
              className={`cat-tab ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}>
              {catIcons[cat]} {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <>
            <div className="results-count">
              {filtered.length} items {category !== 'All' ? `in ${category}` : 'found'}
              {search && ` for "${search}"`}
            </div>
            {filtered.length === 0 ? (
              <div className="empty-shop">
                <div className="empty-icon">🛒</div>
                <h3>No items found</h3>
                <p>Try a different category or search term</p>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map(product => (
                  <div key={product.id} className={`product-card ${product.status === 'Out of Stock' ? 'out-of-stock' : ''}`}>
                    <div className="product-image-wrap">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="product-img" />
                      ) : (
                        <div className="product-img-placeholder">
                          {catIcons[product.category] || '🛒'}
                        </div>
                      )}
                      {product.status === 'Out of Stock' && (
                        <div className="oos-overlay">Out of Stock</div>
                      )}
                      {product.originalPrice > product.price && (
                        <div className="discount-tag">
                          -{Math.round((1 - product.price/product.originalPrice)*100)}%
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="product-category-badge">{catIcons[product.category]} {product.category}</div>
                      <h3 className="product-name">{product.name}</h3>
                      {product.description && <p className="product-desc">{product.description}</p>}
                      <div className="product-meta">
                        <div className="rating">⭐ {product.rating?.toFixed(1)} ({product.reviewCount})</div>
                        <div className="unit-tag">{product.unit}</div>
                      </div>
                      <div className="product-footer">
                        <div className="price-block">
                          <span className="price">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="original-price">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <button
                          className={`add-btn ${product.status === 'Out of Stock' ? 'disabled' : ''}`}
                          onClick={() => handleAdd(product.id)}
                          disabled={product.status === 'Out of Stock' || adding[product.id]}>
                          {adding[product.id] ? '⏳' : product.status === 'Out of Stock' ? '❌' : '+ Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
