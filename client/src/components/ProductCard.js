
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image">
        {product.images?.[0] ? (
          <img src={`http://localhost:5000${product.images[0].url}`} alt={product.name} />
        ) : (
          <div className="no-image">👖</div>
        )}
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
      </div>
      
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <Star size={14} fill="#ffc107" color="#ffc107" />
          <span>{product.averageRating?.toFixed(1) || '0.0'}</span>
          <span>({product.totalReviews})</span>
        </div>
        
        <div className="product-price-row">
          <span className="product-price">${product.price.toFixed(2)}</span>
          {product.comparePrice > 0 && (
            <span className="product-compare">${product.comparePrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
