const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/cbtl_store')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/products', async (req, res) => {
    try {
        let { page, search, category, minPrice, maxPrice, sort } = req.query;
        
        let query = {};
        
        // Search Filter
        if (search) query.name = { $regex: search, $options: 'i' };
        // Category Filter
        if (category) query.category = category;
        // Price Filter
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
        else sortOption = { _id: 1 }; // Default / Featured

        // Pagination setup
        const limit = 8;
        page = Number(page) || 1;
        const skip = (page - 1) * limit;

        const products = await Product.find(query).sort(sortOption).skip(skip).limit(limit);
        const totalItems = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        res.render('products', {
            products,
            currentPage: page,
            totalPages,
            totalItems,
            search: search || '',
            category: category || '',
            minPrice: minPrice || '',
            maxPrice: maxPrice || '',
            sort: sort || 'featured'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.redirect('/products');
        }
        res.render('product-detail', { product });
    } catch (error) {
        console.log(error);
        res.redirect('/products');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
