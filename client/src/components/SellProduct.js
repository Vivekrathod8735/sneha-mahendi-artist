
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './SellProduct.css';

const SellProduct = () => {
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: 'jeans',
    brand: '',
    material: '',
    fit: 'regular',
    waistRise: 'mid',
    sizes: [{ size: '30', quantity: 10 }],
    colors: [{ name: 'Blue', hex: '#1e3a5f' }],
    tags: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewUrls(files.map(f => URL.createObjectURL(f)));
  };

  const addSize = () => {
    setForm({
      ...form,
      sizes: [...form.sizes, { size: '', quantity: 0 }]
    });
  };

  const updateSize = (idx, field, value) => {
    const newSizes = [...form.sizes];
    newSizes[idx][field] = value;
    setForm({ ...form, sizes: newSizes });
  };

  const removeSize = (idx) => {
    setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'sizes' || key === 'colors') {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });
    images.forEach(img => data.append('images', img));

    try {
      await axios.post('http://localhost:5000/api/products', data, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Product listed successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list product');
    }
    
    setLoading(false);
  };

  return (
    <div className="sell-page">
      <div className="container">
        <h1 className="page-title">Sell Your Pants</h1>
        
        <form onSubmit={handleSubmit} className="sell-form">
          {/* Images */}
          <div className="form-section">
            <h3>Product Images</h3>
            <div className="image-upload">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                id="images"
              />
              <label htmlFor="images" className="upload-area">
                <Upload size={32} />
                <span>Click to upload images</span>
              </label>
            </div>
            
            {previewUrls.length > 0 && (
              <div className="preview-grid">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="preview-item">
                    <img src={url} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g., Slim Fit Dark Wash Jeans" />
            </div>
            
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe your pants..." />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Price ($) *</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Compare at Price ($)</label>
                <input name="comparePrice" type="number" step="0.01" value={form.comparePrice} onChange={handleChange} placeholder="Original price" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="form-section">
            <h3>Product Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="jeans">Jeans</option>
                  <option value="chinos">Chinos</option>
                  <option value="cargo">Cargo</option>
                  <option value="joggers">Joggers</option>
                  <option value="dress-pants">Dress Pants</option>
                  <option value="shorts">Shorts</option>
                  <option value="sweatpants">Sweatpants</option>
                  <option value="khakis">Khakis</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fit *</label>
                <select name="fit" value={form.fit} onChange={handleChange}>
                  <option value="slim">Slim</option>
                  <option value="regular">Regular</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="skinny">Skinny</option>
                  <option value="straight">Straight</option>
                  <option value="athletic">Athletic</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Brand</label>
                <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g., Levi's" />
              </div>
              <div className="form-group">
                <label>Material</label>
                <input name="material" value={form.material} onChange={handleChange} placeholder="e.g., 98% Cotton, 2% Elastane" />
              </div>
            </div>
            
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="vintage, stretch, casual" />
            </div>
          </div>

          {/* Sizes */}
          <div className="form-section">
            <h3>Sizes & Inventory</h3>
            
            {form.sizes.map((size, idx) => (
              <div key={idx} className="size-row">
                <input
                  placeholder="Size"
                  value={size.size}
                  onChange={(e) => updateSize(idx, 'size', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={size.quantity}
                  onChange={(e) => updateSize(idx, 'quantity', parseInt(e.target.value) || 0)}
                />
                {form.sizes.length > 1 && (
                  <button type="button" onClick={() => removeSize(idx)} className="remove-size">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            
            <button type="button" onClick={addSize} className="btn btn-secondary add-size-btn">
              + Add Size
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-large submit-btn" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellProduct;
            
