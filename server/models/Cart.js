
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    size: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true
    }
  }],
  coupon: {
    code: String,
    discount: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
