
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, fetchCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  if (!user) {
    return (
      <div className="cart-page">
        <div className="container empty-state">
          <div className="empty-state-icon">🔒</div>
          <h3>Please login to view your cart</h3>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any pants yet</p>
          <Link to="/" className="btn btn-primary">
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart ({cartItems.length} items)</h1>
        
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  {item.product?.images?.[0] ? (
                    <img src={`http://localhost:5000${item.product.images[0].url}`} alt={item.name} />
                  ) : (
                    <div className="item-placeholder">👖</div>
                  )}
                </div>
                
                <div className="item-details">
                  <h3>{item.product?.name || item.name}</h3>
                  <p className="item-variant">Size: {item.size} {item.color && `/ Color: ${item.color}`}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="item-quantity">
                  <span>Qty: {item.quantity}</span>
                </div>
                
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            {shipping > 0 && (
              <p className="free-shipping-note">
                Add ${(75 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button
              className="btn btn-primary btn-large checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
            
            <Link to="/" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
      
