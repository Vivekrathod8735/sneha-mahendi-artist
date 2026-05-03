
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { CreditCard, Truck, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { user, getAuthHeaders } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });

  const [payment, setPayment] = useState('card');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/orders/create',
        {
          shippingAddress: shipping,
          paymentMethod: payment
        },
        { headers: getAuthHeaders() }
      );

      if (res.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/orders');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
    setLoading(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container empty-state">
          <h3>Your cart is empty</h3>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        
        {/* Progress */}
        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-icon">{step > 1 ? <Check size={16} /> : '1'}</div>
            <span>Shipping</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-icon">2</div>
            <span>Payment</span>
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-forms">
            {step === 1 ? (
              <form onSubmit={handleShippingSubmit} className="checkout-form">
                <h2>Shipping Address</h2>
                
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={shipping.name}
                    onChange={(e) => setShipping({...shipping, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={shipping.street}
                    onChange={(e) => setShipping({...shipping, street: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={(e) => setShipping({...shipping, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={shipping.state}
                      onChange={(e) => setShipping({...shipping, state: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      value={shipping.zipCode}
                      onChange={(e) => setShipping({...shipping, zipCode: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      value={shipping.country}
                      onChange={(e) => setShipping({...shipping, country: e.target.value})}
                    >
                      <option value="USA">United States</option>
                      <option value="CAN">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary btn-large">
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div className="checkout-form">
                <h2>Payment Method</h2>
                
                <div className="payment-options">
                  <label className={`payment-option ${payment === 'card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={payment === 'card'}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    <CreditCard size={24} />
                    <div>
                      <strong>Credit/Debit Card</strong>
                      <span>Visa, Mastercard, Amex</span>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${payment === 'paypal' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={payment === 'paypal'}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    <div className="paypal-icon">P</div>
                    <div>
                      <strong>PayPal</strong>
                      <span>Pay with your PayPal account</span>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${payment === 'cod' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={payment === 'cod'}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                    <Truck size={24} />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <span>Pay when you receive</span>
                    </div>
                  </label>
                </div>
                
                <div className="form-actions">
                  <button onClick={() => setStep(1)} className="btn btn-secondary">
                    ← Back
                  </button>
                  <button
                    onClick={placeOrder}
                    className="btn btn-primary btn-large"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item._id} className="summary-item">
                  <div className="summary-item-img">
                    {item.product?.images?.[0] ? (
                      <img src={`http://localhost:5000${item.product.images[0].url}`} alt="" />
                    ) : (
                      <span>👖</span>
                    )}
                  </div>
                  <div className="summary-item-info">
                    <p className="item-name">{item.product?.name}</p>
                    <p className="item-variant">Qty: {item.quantity} / Size: {item.size}</p>
                  </div>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="total-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
