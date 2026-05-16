const fs = require('fs');
let html = fs.readFileSync('Assignment 3/views/products.ejs', 'utf-8');

const newStyles = `
        .products-page-container {
            max-width: 1400px;
            margin: 40px auto;
            padding: 0 20px;
        }
        .filter-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ddd;
            padding-bottom: 20px;
            margin-bottom: 40px;
            flex-wrap: wrap;
            font-family: Arial, sans-serif;
            font-size: 14px;
        }
        .filter-left, .filter-right {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .filter-label {
            font-weight: bold;
            color: #333;
        }
        .filter-bar select {
            border: none;
            outline: none;
            font-size: 14px;
            background: transparent;
            cursor: pointer;
            color: #333;
        }
        .filter-bar select:hover {
            color: #543265;
        }
        .sort-select {
            background: #f4f4f4 !important;
            padding: 8px 15px;
            border: 1px solid #ddd !important;
            border-radius: 2px;
        }
        .product-count {
            color: #666;
            margin-left: 10px;
        }
        .products-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 40px 20px;
        }
        @media (max-width: 1024px) {
            .products-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
            .products-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
            .products-grid { grid-template-columns: 1fr; }
        }
        .product-card {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            position: relative;
        }
        .product-card img {
            width: 100%;
            height: 380px;
            object-fit: contain;
            margin-bottom: 15px;
        }
        .product-card h3 {
            font-size: 16px;
            color: #222;
            text-transform: uppercase;
            font-weight: 800;
            margin: 0 0 15px 0;
            line-height: 1.4;
        }
        .product-card p.price {
            font-weight: 600;
            font-size: 14px;
            color: #222;
            margin: 0 0 15px 0;
        }
        .add-to-cart {
            width: 100%;
            padding: 12px;
            background: #543265;
            color: white;
            border: none;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            display: none;
            text-transform: uppercase;
        }
        .product-card:hover .add-to-cart {
            display: block;
        }
        .pagination {
            display: flex;
            justify-content: center;
            margin-top: 60px;
            margin-bottom: 60px;
            gap: 15px;
        }
        .pagination a, .pagination span {
            padding: 10px 18px;
            border: 1px solid #ccc;
            text-decoration: none;
            color: #333;
            font-weight: bold;
            font-size: 14px;
        }
        .pagination .active {
            background: #543265;
            color: white;
            border-color: #543265;
        }
`;

html = html.replace(/<style>[\s\S]*?<\/style>/, '<style>\n' + newStyles + '\n</style>');

const newBody = `
<div class="products-page-container">

    <form class="filter-bar" method="GET" action="/products" id="filterForm">
        <% if(search) { %><input type="hidden" name="search" value="<%= search %>"><% } %>
        
        <div class="filter-left">
            <span class="filter-label">Filter:</span>
            <select name="category" onchange="document.getElementById('filterForm').submit()">
                <option value="">Category</option>
                <option value="Coffee" <%= category === 'Coffee' ? 'selected' : '' %>>Coffee</option>
                <option value="Tea" <%= category === 'Tea' ? 'selected' : '' %>>Tea</option>
                <option value="Powders" <%= category === 'Powders' ? 'selected' : '' %>>Powders</option>
            </select>
            <select><option>Roast</option></select>
            <select><option>Region</option></select>
            <select><option>Bag Weight</option></select>
        </div>

        <div class="filter-right">
            <span class="filter-label">Sort by:</span>
            <select class="sort-select">
                <option>Featured</option>
            </select>
            <span class="product-count"><%= totalItems %> products</span>
        </div>
    </form>

    <div class="products-grid">
        <% if(products.length > 0) { %>
            <% products.forEach(product => { %>
                <div class="product-card">
                    <img src="<%= product.image %>" alt="<%= product.name %>">
                    <button class="add-to-cart">ADD TO CART</button>
                    <h3><%= product.name %></h3>
                    <p class="price">$<%= product.price %>.99</p>
                </div>
            <% }) %>
        <% } else { %>
            <p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem;">No products found.</p>
        <% } %>
    </div>

    <% if(totalPages > 1) { %>
        <div class="pagination">
            <% let queryStr = \`&search=\${search}&category=\${category}\`; %>
            <% if(currentPage > 1) { %><a href="/products?page=<%= currentPage - 1 %><%= queryStr %>">PREV</a><% } %>
            <% for(let i = 1; i <= totalPages; i++) { %>
                <a href="/products?page=<%= i %><%= queryStr %>" class="<%= currentPage === i ? 'active' : '' %>"><%= i %></a>
            <% } %>
            <% if(currentPage < totalPages) { %><a href="/products?page=<%= currentPage + 1 %><%= queryStr %>">NEXT</a><% } %>
        </div>
    <% } %>
</div>
`;

html = html.replace(/<div class="products-page-container">[\s\S]*?<\/div>\s*<script src="script.js"><\/script>/, newBody + '\n<script src="script.js"></script>');

fs.writeFileSync('Assignment 3/views/products.ejs', html);
