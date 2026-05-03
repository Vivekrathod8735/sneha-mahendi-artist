
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-logo">👖 PantsStore</span>
            <p>Your destination for quality pants. Buy premium styles or sell your own collection.</p>
          </div>
          
          <div className="footer-links">
            <h4>Shop</h4>
            <Link to="/">All Pants</Link>
            <Link to="/?category=jeans">Jeans</Link>
            <Link to="/?category=chinos">Chinos</Link>
            <Link to="/?category=joggers">Joggers</Link>
          </div>
          
          <div className="footer-links">
            <h4>Sell</h4>
            <Link to="/sell">Start Selling</Link>
            <Link to="/dashboard">Seller Dashboard</Link>
          </div>
          
          <div className="footer-links">
            <h4>Support</h4>
            <Link to="/">Help Center</Link>
            <Link to="/">Shipping Info</Link>
            <Link to="/">Returns</Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 PantsStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
