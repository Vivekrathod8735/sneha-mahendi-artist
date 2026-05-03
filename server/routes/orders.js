
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Create order
router.post('/create', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 75 ? 0 : 9.99;
    const total = subtotal + tax + shipping;
    
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.product.images[0]?.url
    }));
    
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      payment: {
        method: paymentMethod,
        amount: total,
        status: 'pending'
      },
      subtotal,
      tax,
      shipping: {
        method: subtotal > 75 ? 'Free Shipping' : 'Standard Shipping',
        cost: shipping,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      total
    });
    
    await order.save();
    
    // Update stock
    for (const item of cart.items) {
      await Product.updateOne(
        { _id: item.product._id, 'sizes.size': item.size },
        { $inc: { 'sizes.$.quantity': -item.quantity, sales: item.quantity } }
      );
    }
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully'
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');
    
    res.json({ success: true, orders });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product');
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    res.json({ success: true, order });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
                                            
