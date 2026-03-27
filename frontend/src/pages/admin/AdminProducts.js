import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { productAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './AdminProducts.css';

const CATS = ['Fruits','Vegetables','Dairy','Bakery','Beverages','Snacks','Meat','Frozen'];
const CAT_ICONS = { Fruits:'🍎', Vegetables:'🥕', Dairy:'🥛', Bakery:'🍞', Beverages:'🥤', Snacks:'🍫', Meat:'🥩', Frozen:'🧊' };
const EMPTY = { name:'', description:'', price:'', originalPrice:'', stock:'', image:'', category:'Fruits', unit:'kg', featured:false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productAPI.adminGetAll();
      setProducts(res.data);
    } finally { setLoading(false); }
  };

  const openAdd = () => { setEditProduct(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name:p.name, description:p.description||'', price:p.price, originalPrice:p.originalPrice||'', stock:p.stock, image:p.image||'', category:p.category||'Fruits', unit:p.unit||'kg', featured:p.featured||false });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || form.stock === '') {
      toast.error('Please fill required fields'); return;
    }
    setSaving(true);
    try {
      const data = { ...form, price: parseFloat(form.price), originalPrice: parseFloat(form.originalPrice)||0, stock: parseInt(form.stock) };
      if (editProduct) {
        await productAPI.update(editProduct.id, data);
        toast.success('Product updated!');
      } else {
        await productAPI.add(data);
        toast.success('Product added! 🥦');
      }
      setShowModal(false);
      loadProducts();
    } catch { toast.error('Failed to save product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await productAPI.delete(id);
    toast.success('Product deleted');
    loadProducts();
  };

  const toggleStock = async (product) => {
    const newStock = product.status === 'Out of Stock' ? 10 : 0;
    await productAPI.updateStock(product.id, newStock);
    loadProducts();
  };

  const filtered = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat;
    return matchName && matchCat;
  });

  const set = f => e => setForm({...form, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value});

  return (
    <div className="admin-page">
      <Navbar />
      <div className="page-container">
        <div className="admin-header">
          <div>
            <h1>🛍️ Products</h1>
            <p>{products.length} total products</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>

        <div className="products-filters">
          <input className="filter-search" placeholder="🔍 Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <div className="filter-cats">
            {['All', ...CATS].map(cat => (
              <button key={cat} className={`cat-tab ${filterCat === cat ? 'active' : ''}`} onClick={() => setFilterCat(cat)}>
                {CAT_ICONS[cat] || '🛒'} {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <div className="admin-products-grid">
            {filtered.map(product => (
              <div key={product.id} className={`admin-prod-card ${product.status === 'Out of Stock' ? 'oos' : ''}`}>
                <div className="apcard-img">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="apcard-placeholder">{CAT_ICONS[product.category] || '🛒'}</div>
                  )}
                  {product.featured && <div className="featured-tag">⭐ Featured</div>}
                  <div className={`status-dot ${product.status === 'Available' ? 'available' : 'oos'}`} />
                </div>
                <div className="apcard-info">
                  <div className="apcard-cat">{CAT_ICONS[product.category]} {product.category}</div>
                  <h3>{product.name}</h3>
                  <div className="apcard-meta">
                    <span className="apcard-price">₹{product.price}</span>
                    <span className="apcard-unit">{product.unit}</span>
                    <span className={`apcard-stock ${product.stock === 0 ? 'zero' : ''}`}>
                      📦 {product.stock}
                    </span>
                  </div>
                  <div className="apcard-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(product)}>✏️ Edit</button>
                    <button className={`btn btn-sm ${product.status === 'Out of Stock' ? 'btn-primary' : 'btn-orange'}`} onClick={() => toggleStock(product)}>
                      {product.status === 'Out of Stock' ? '✅ In Stock' : '❌ OOS'}
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" value={form.name} onChange={set('name')} placeholder="Product name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={set('category')}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" value={form.description} onChange={set('description')} placeholder="Short description" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-input" type="number" value={form.price} onChange={set('price')} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input className="form-input" type="number" value={form.originalPrice} onChange={set('originalPrice')} placeholder="For strikethrough" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input className="form-input" type="number" value={form.stock} onChange={set('stock')} placeholder="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select className="form-input" value={form.unit} onChange={set('unit')}>
                    {['kg','g','litre','ml','piece','pack','dozen','bundle'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-input" value={form.image} onChange={set('image')} placeholder="https://..." />
              </div>
              <div className="form-check">
                <input type="checkbox" id="featured" checked={form.featured} onChange={set('featured')} />
                <label htmlFor="featured">⭐ Featured product (shown on homepage)</label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? '⏳ Saving...' : editProduct ? '✅ Update' : '➕ Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
