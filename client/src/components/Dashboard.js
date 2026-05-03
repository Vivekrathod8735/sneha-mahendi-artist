
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Package, DollarSign, TrendingUp, Eye } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, getAuthHeaders } = useAuth();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, sales: 0, views: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/seller/my-products', {
        headers: getAuthHeaders()
      });
      const products = res.data.products || [];
      setProducts(products);
      
      setStats({
        total: products.length,
        sales: products.reduce((s, p) => s + (p.sales || 0), 0),
        views: products.reduce((s, p) => s + (p.views || 0), 0),
        revenue: products.reduce((s, p) => s + ((p.sales || 0) * p.price), 0)
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="page-title">Seller Dashboard</h1>
        
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <Package size={24} />
            <div>
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Products</span>
            </div>
          </div>
          <div className="stat-card">
            <TrendingUp size={24} />
            <div>
              <span className="stat-value">{stats.sales}</span>
              <span className="stat-label">Sales</span>
            </div>
          </div>
          <div className="stat-card">
            <Eye size={24} />
            <div>
              <span className="stat-value">{stats.views}</span>
              <span className="stat-label">Views</span>
            </div>
          </div>
          <div className="stat-card">
            <DollarSign size={24} />
            <div>
              <span className="stat-value">${stats.revenue.toFixed(2)}</span>
              <span className="stat-label">Revenue</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="dashboard-actions">
          <Link to="/sell" className="btn btn-primary">
            + Add New Product
          </Link>
        </div>

        {/* Products Table */}
        <div className="products-table">
          <h2>My Products</h2>
          
          {products.length === 0 ? (
            <div className="empty-state">
              <p>No products yet. Start selling!</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sales</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-cell">
                        {product.images?.[0] ? (
                          <img src={`http://localhost:5000${product.images[0].url}`} alt="" />
                        ) : (
                          <div className="img-placeholder">👖</div>
                        )}
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.sizes?.reduce((s, sz) => s + sz.quantity, 0) || 0}</td>
                    <td>{product.sales || 0}</td>
                    <td>
                      <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
                  
