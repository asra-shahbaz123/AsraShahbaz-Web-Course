const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path');
const { isLoggedIn } = require('./middleware/auth');
const methodOverride = require('method-override');
const Product = require('./models/Product');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/cbtlshop')
    .then(() => console.log('db connected'))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use(session({
    secret: 'cbtlsecretkey123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/cbtlshop' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(flash());

app.use((req, res, next) => {
      console.log('session:', req.session) 
    res.locals.currentUser = req.session.userId ? {
        id: req.session.userId,
        name: req.session.userName,
        role: req.session.userRole
    } : null;
    next();
});

app.use('/', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));

app.get('/', (req, res) => {
    res.render('home', { messages: req.flash() });
});

app.get('/products', async (req, res) => {
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

        res.render('products', {
            products,
            currentPage: page,
            totalPages,
            totalItems,
            search: search || '',
            category: category || '',
            minPrice: minPrice || '',
            maxPrice: maxPrice || '',
            sort: sort || 'featured',
            messages: req.flash()
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

app.get('/health', (req, res) => {
    res.send('ok');
});

app.get('/checkout', isLoggedIn, (req, res) => {
    res.render('checkout', { messages: req.flash() });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send('Server error');
});

app.listen(3000, () => console.log('running on port 3000'));