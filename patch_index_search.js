const fs = require('fs');
let html = fs.readFileSync('Assignment 3/views/index.ejs', 'utf-8');

html = html.replace(
    '<div class="SearchBar">\n            <input placeholder="Search for Products..." class="searchInput"/>\n            <div class="SearchIcon">\n                <i class="fa-solid fa-magnifying-glass"></i>\n            </div>\n        </div>', 
    '<div class="SearchBar">\n            <form action="/products" method="GET" style="display:flex; width:100%; align-items:center;">\n                <input name="search" placeholder="Search for products..." class="searchInput" style="border:none;"/>\n                <button type="submit" class="SearchIcon" style="background:none; border:none; cursor:pointer;">\n                    <i class="fa-solid fa-magnifying-glass"></i>\n                </button>\n            </form>\n        </div>'
);
fs.writeFileSync('Assignment 3/views/index.ejs', html);
