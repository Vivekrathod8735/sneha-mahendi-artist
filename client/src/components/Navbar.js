
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isSeller } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <span className="logo-icon">👖</span>
          <span className="logo-text">PantsStore</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          {isSeller && (
            <>
              <Link to="/sell" onClick={() => setMenuOpen(false)}>Sell</Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            </>
          )}
          {user && <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>}
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span>{user.name}</span>
              <button onClick={() => { logout(); navigate('/'); }} className="btn btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
