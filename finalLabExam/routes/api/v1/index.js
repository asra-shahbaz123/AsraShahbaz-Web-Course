const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../../../models/Product');
const User = require('../../../models/User');
const verifyToken = require('../../../middleware/verifyToken');

// Load environment variables
require('dotenv').config();

// GET /api/v1/products
router.get('/products', async (req, res) => {
    try {
        let { page, search, category, minPrice, maxPrice, sort } = req.query;
        let query = {};
        
        if (search) query.name = { $regex: search, $options: 'i' };
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        
        let sortOption = {};
        if (sort === 'price_asc') sortOption = { price: 1 };
        else if (sort === 'price_desc') sortOption = { price: -1 };
        else if (sort === 'name_asc') sortOption = { name: 1 };
        else if (sort === 'name_desc') sortOption = { name: -1 };
        else sortOption = { _id: 1 }; 

        const limit = 8;
        page = Number(page) || 1;
        const skip = (page - 1) * limit;

        const products = await Product.find(query).sort(sortOption).skip(skip).limit(limit);
        const totalItems = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            products,
            currentPage: page,
            totalPages,
            totalItems
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET /api/v1/products/:id
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /api/v1/auth/login
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const bcrypt = require('bcryptjs');
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const payload = {
            user_id: user._id,
            role: user.role
        };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '1h'
        });
        
        res.json({ token, message: 'Logged in successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /api/v1/orders
router.post('/orders', verifyToken, async (req, res) => {
    try {
        // Dummy order creation
        res.status(201).json({ 
            message: 'Order created successfully', 
            user: req.user,
            orderData: req.body 
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET /api/v1/user/profile
router.get('/user/profile', verifyToken, async (req, res) => {
    try {
        // req.user has the decoded payload
        const user = await User.findById(req.user.user_id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            profile: user,
            jwtPayload: req.user
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;