
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const categories = [
    { id: 'jeans', name: 'Jeans', icon: '👖' },
    { id: 'chinos', name: 'Chinos', icon: '👔' },
    { id: 'cargo', name: 'Cargo', icon: '🎒' },
    { id: 'joggers', name: 'Joggers', icon: '🏃' },
    { id: 'dress-pants', name: 'Dress Pants', icon: '💼' },
    { id: 'shorts', name: 'Shorts', icon: '🩳' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      const res = await axios.get(`http://localhost:5000/api/products?${params}`);
      setProducts(res.data.products);
    } catch (err) {
      console.error('Failed to load');
    }
    setLoading(false);
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <h1>👖 Premium Pants for Every Style</h1>
          <p>Buy quality pants or sell your own collection</p>
          <div className="hero-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search jeans, chinos, joggers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="categories-scroll">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-pill ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(category === cat.id ? '' : cat.id)}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No pants found</h3>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
