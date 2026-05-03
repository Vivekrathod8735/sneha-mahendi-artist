
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data.product);
      if (res.data.product.colors?.[0]) {
        setSelectedColor(res.data.product.colors[0].name);
      }
    } catch (err) {
      toast.error('Product not found');
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    const success = await addToCart(id, quantity, selectedSize, selectedColor);
    if (success) {
      setQuantity(1);
    }
  };

  const submitReview = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/products/${id}/review`,
        { rating: reviewRating, review: reviewText },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Review submitted!');
      setReviewText('');
      fetchProduct();
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  ifI'll continue building the complete pants store for you. Let me finish the remaining components.

---

### 27. `client/src/components/ProductDetail.js` (Continued)

```javascript
  if (!product) return <div className="empty-state"><h3>Product not found</h3></div>;

  const availableSizes = product.sizes?.filter(s => s.quantity > 0) || [];

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-layout">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              {product.images?.[selectedImage] ? (
                <img src={`http://localhost:5000${product.images[selectedImage].url}`} alt={product.name} />
              ) : (
                <div className="no-image-large">👖</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="thumbnail-list">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={selectedImage === idx ? 'active' : ''}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={`http://localhost:5000${img.url}`} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-details">
            <span className="detail-category">{product.category}</span>
            <h1>{product.name}</h1>
            
            <div className="detail-rating">
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <Star
                    key={star}
                    size={18}
                    fill={star <= Math.round(product.averageRating) ? '#ffc107' : 'none'}
                    color={star <= Math.round(product.averageRating) ? '#ffc107' : '#ddd'}
                  />
                ))}
              </div>
              <span>{product.averageRating?.toFixed(1)} ({product.totalReviews} reviews)</span>
            </div>

            <div className="detail-price">
              <span className="current-price">${product.price.toFixed(2)}</span>
              {product.comparePrice > 0 && (
                <span className="original-price">${product.comparePrice.toFixed(2)}</span>
              )}
            </div>

            <p className="detail-description">{product.description}</p>

            {/* Size Selection */}
            <div className="selection-group">
              <label>Select Size</label>
              <div className="size-selector">
                {product.sizes?.map(size => (
                  <button
                    key={size.size}
                    className={`size-btn ${selectedSize === size.size ? 'active' : ''} ${size.quantity === 0 ? 'out-of-stock' : ''}`}
                    onClick={() => size.quantity > 0 && setSelectedSize(size.size)}
                    disabled={size.quantity === 0}
                  >
                    {size.size}
                    {size.quantity === 0 && <span className="oos-label">OOS</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="selection-group">
                <label>Color: <strong>{selectedColor}</strong></label>
                <div className="color-selector">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      className={selectedColor === color.name ? 'active' : ''}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    >
                      <span
                        className="color-swatch"
                        style={{ backgroundColor: color.hex || '#ccc' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="selection-group">
              <label>Quantity</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="product-actions">
              <button className="btn btn-primary btn-large add-cart-btn" onClick={handleAddToCart}>
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="btn btn-secondary btn-icon">
                <Heart size={20} />
              </button>
              <button className="btn btn-secondary btn-icon">
                <Share2 size={20} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div><Truck size={20} /> Free shipping over $75</div>
              <div><Shield size={20} /> Secure payment</div>
              <div><RotateCcw size={20} /> 30-day returns</div>
            </div>

            {/* Product Specs */}
            <div className="product-specs">
              <div><span>Brand:</span> {product.brand || 'N/A'}</div>
              <div><span>Material:</span> {product.material || 'N/A'}</div>
              <div><span>Fit:</span> {product.fit}</div>
              <div><span>Waist Rise:</span> {product.waistRise}</div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          
          {user && (
            <div className="add-review">
              <h3>Write a Review</h3>
              <div className="rating-input">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                  >
                    <Star
                      size={24}
                      fill={star <= reviewRating ? '#ffc107' : 'none'}
                      color={star <= reviewRating ? '#ffc107' : '#ddd'}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about these pants..."
                rows={4}
              />
              <button className="btn btn-primary" onClick={submitReview}>
                Submit Review
              </button>
            </div>
          )}

          <div className="reviews-list">
            {product.ratings?.map((review, idx) => (
              <div key={idx} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="reviewer-name">{review.user?.name || 'Anonymous'}</div>
                      <div className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="review-stars">
                    {[1,2,3,4,5].map(s => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= review.rating ? '#ffc107' : 'none'}
                        color={s <= review.rating ? '#ffc107' : '#ddd'}
                      />
                    ))}
                  </div>
                </div>
                <p className="review-text">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
                                    
