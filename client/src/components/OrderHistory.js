
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import './Dashboard.css';

const OrderHistory = () => {
  const { getAuthHeaders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: getAuthHeaders()
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={20} color="#28a745" />;
      case 'shipped': return <Truck size={20} color="#007bff" />;
      case 'processing': return <Package size={20} color="#ffc107" />;
      default: return <Clock size={20} color="#6c757d" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={`order-status ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                </div>
                
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      {item.image && (
                        <img src={`http://localhost:5000${item.image}`} alt={item.name} />
                      )}
                      <div className="order-item-info">
                        <p className="item-name">{item.name}</p>
                        <p className="item-meta">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="order-footer">
                  <div className="order-totals">
                    <span>Total: <strong>${order.total.toFixed(2)}</strong></span>
                  </div>
                  {order.shipping?.trackingNumber && (
                    <span className="tracking">Tracking: {order.shipping.trackingNumber}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
