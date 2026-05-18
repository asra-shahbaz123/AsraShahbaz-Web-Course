const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/cbtlshop')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.log(err));

const coffeeImages = ['CBTL_333_1.png', 'CBTL_333_3.png', 'CBTL_333_1.avif', 'CBTL_333_3.avif'];
const teaImages = [
    'E-Comm_Tea_20ct_TropicalPassion-01(Tea).webp',
    'E-Comm_Tea_22COR_KL_20ct_EarlGrey-01(Tea).webp',
    'E-Comm_Tea_22COR_KL_ApricotCeylon_v1-01(tea).webp',
    'E-Comm_Tea_22COR_KL_EnglishBreakfast-01(Tea).webp',
    'E-Comm_Tea_23COR_KL_GinsengPeppermint-01(Tea).webp'
];
const powderImages = [
    'E-Comm_Powder_Chocolate_Powder_Special_Dutch-08(powder).webp',
    'E-Comm_Powder_MatchaShizuokaPowder_v3-01(powder).webp',
    'E-Comm_Powder_NSAVanillaPowder_FillLine_v2-01(powder).webp'
];

const seedProducts = async () => {
    await Product.deleteMany({});
    
    const products = [];
    
    // Create 15 Coffees
    for (let i = 1; i <= 15; i++) {
        products.push({
            name: `10 OZ L.A. ROAST ORGANIC ${i}`,
            price: 16,
            category: 'Coffee',
            rating: 5,
            stock: 100,
            image: coffeeImages[i % coffeeImages.length]
        });
    }

    // Create 15 Teas
    for (let i = 1; i <= 15; i++) {
        products.push({
            name: `ENGLISH BREAKFAST BLACK TEA ${i}`,
            price: 14,
            category: 'Tea',
            rating: 5,
            stock: 100,
            image: teaImages[i % teaImages.length]
        });
    }

    // Create 11 Powders (makes total 41 for realism as in screenshot)
    for (let i = 1; i <= 11; i++) {
        let isOnSale = i % 2 === 0;
        products.push({
            name: `FRENCH VANILLA POWDER ${i}`,
            price: 24,
            category: 'Powders',
            rating: 5,
            stock: 100,
            image: powderImages[i % powderImages.length],
            isOnSale: isOnSale,
            salePrice: isOnSale ? (24 * 0.8).toFixed(2) : undefined 
        });
    }

    // Make some coffees and teas on sale too
    products.forEach((p, index) => {
        if (p.category !== 'Powders') {
            p.isOnSale = index % 3 === 0;
            if (p.isOnSale) p.salePrice = (p.price * 0.8).toFixed(2);
        }
    });

    await Product.insertMany(products);
    console.log('Database Seeded with 41 products!');
    process.exit();
};

seedProducts();
