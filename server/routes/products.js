
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { auth, sellerOrAdmin } = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, size, fit, search, sort, page = 1, limit = 12 } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (fit) query.fit = fit;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (size) {
      query['sizes'] = { $elemMatch: { size: size, quantity: { $gt: 0 } } };
    }
    if (search) {
      query.$text = { $search: search };
    }
    
    let sortOption = {};
    if (sort === 'price-low') sortOption.price = 1;
    else if (sort === 'price-high') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else if (sort === 'popular') sortOption.sales = -1;
    else sortOption.createdAt = -1;
    
    const products = await Product.find(query)
      .populate('seller', 'name')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Product.countDocuments(query);
    
    res.json({
      success: true,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name')
      .populate('ratings.user', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.views += 1;
    await product.save();
    
    res.json({ success: true, product });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product
router.post('/', auth, sellerOrAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name, description, price, comparePrice, category,
      sizes, colors, brand, material, fit, waistRise, length, tags
    } = req.body;
    
    const images = req.files?.map(file => ({
      url: `/uploads/${file.filename}`,
      alt: name
    })) || [];
    
    const product = new Product({
      name,
      description,
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : 0,
      category,
      sizes: JSON.parse(sizes || '[]'),
      colors: JSON.parse(colors || '[]'),
      images,
      brand,
      material,
      fit,
      waistRise,
      length,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      seller: req.user._id
    });
    
    await product.save();
    
    res.status(201).json({ success: true, product });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get seller's products
router.get('/seller/my-products', auth, sellerOrAdmin, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, products });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
    
