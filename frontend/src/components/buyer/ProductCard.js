import React from 'react';
import './ProductCard.css';

const CAT_ICONS = { Fruits:'🍎', Vegetables:'🥕', Dairy:'🥛', Bakery:'🍞', Beverages:'🥤', Snacks:'🍫', Meat:'🥩', Frozen:'🧊' };

export default function ProductCard({ product, onAdd, adding }) {
  return (
    <div className={`product-card ${product.status === 'Out of Stock' ? 'out-of-stock' : ''}`}>
      <div className="product-image-wrap">
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-img" />
        ) : (
          <div className="product-img-placeholder">{CAT_ICONS[product.category] || '🛒'}</div>
        )}
        {product.status === 'Out of Stock' && <div className="oos-overlay">Out of Stock</div>}
        {product.originalPrice > product.price && (
          <div className="discount-tag">-{Math.round((1 - product.price/product.originalPrice)*100)}%</div>
        )}
      </div>
      <div className="product-info">
        <div className="product-category-badge">{CAT_ICONS[product.category]} {product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        {product.description && <p className="product-desc">{product.description}</p>}
        <div className="product-meta">
          <div className="rating">⭐ {product.rating?.toFixed(1)}</div>
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
            onClick={() => onAdd(product.id)}
            disabled={product.status === 'Out of Stock' || adding}>
            {adding ? '⏳' : product.status === 'Out of Stock' ? '❌' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
