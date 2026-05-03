
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['jeans', 'chinos', 'cargo', 'joggers', 'dress-pants', 'shorts', 'sweatpants', 'khakis']
  },
  sizes: [{
    size: { type: String, required: true },
    quantity: { type: Number, default: 0 }
  }],
  colors: [{
    name: String,
    hex: String
  }],
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' }
  }],
  brand: {
    type: String,
    default: ''
  },
  material: {
    type: String,
    default: ''
  },
  fit: {
    type: String,
    enum: ['slim', 'regular', 'relaxed', 'skinny', 'straight', 'athletic'],
    default: 'regular'
  },
  waistRise: {
    type: String,
    enum: ['low', 'mid', 'high'],
    default: 'mid'
  },
  length: {
    type: String,
    default: ''
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    date: { type: Date, default: Date.now }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
