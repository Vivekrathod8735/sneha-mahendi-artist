
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await register(form.name, form.email, form.password, form.phone, form.role);
    
    if (result.success) {
      toast.success('Account created!');
      navigate('/');
    } else {
      toast.error(result.message || 'Registration failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">👖</span>
          <h1>Create Account</h1>
          <p>Join Pants Store to buy and sell</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required />
          </div>
          
          <div className="form-group">
            <label>Phone (optional)</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
          </div>
          
          <div className="form-group">
            <label>Account Type</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="customer">Customer - I want to buy</option>
              <option value="seller">Seller - I want to sell</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            <UserPlus size={18} />
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
    
