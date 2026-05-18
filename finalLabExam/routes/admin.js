const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

router.use(isAdmin);

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }
}).single('image');

router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        const products = await Product.find({});
        res.render('admin', { users, products, session: req.session, messages: req.flash() });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading admin dashboard");
    }
});

router.get('/products/new', (req, res) => {
    res.render('admin-new', { error: null });
});

router.post('/products', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.render('admin-new', { error: err.message });
        }
        try {
            const { name, price, category, rating, stock } = req.body;
            let productData = { name, price, category, rating, stock };
            if (req.file) {
                productData.image = '/uploads/' + req.file.filename;
            }
            const newProduct = new Product(productData);
            await newProduct.save();
            res.redirect('/admin');
        } catch (error) {
            console.log(error);
            res.status(500).send("Error saving product");
        }
    });
});

router.get('/products/:id/edit', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('admin-edit', { product });
    } catch (err) {
        res.status(500).send("Error loading edit form");
    }
});

router.put('/products/:id', (req, res) => {
    upload(req, res, async (err) => {
        try {
            const { name, price, category, rating, stock } = req.body;
            let productData = { name, price, category, rating, stock };
            if (req.file) {
                productData.image = '/uploads/' + req.file.filename;
            }
            await Product.findByIdAndUpdate(req.params.id, productData);
            res.redirect('/admin');
        } catch (error) {
            console.log(error);
            res.status(500).send("Error updating product");
        }
    });
});

router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting product");
    }
});

module.exports = router;
