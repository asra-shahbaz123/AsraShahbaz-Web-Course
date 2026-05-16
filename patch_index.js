const fs = require('fs');
let html = fs.readFileSync('Assignment 3/views/index.ejs', 'utf-8');

html = html.replace('<div class="box">', '<div class="box" onclick="window.location.href=\'/products?category=Coffee\'" style="cursor:pointer">');
html = html.replace('<div class="box">', '<div class="box" onclick="window.location.href=\'/products?category=Tea\'" style="cursor:pointer">');
html = html.replace('<div class="box">', '<div class="box" onclick="window.location.href=\'/products?category=Powders\'" style="cursor:pointer">');

fs.writeFileSync('Assignment 3/views/index.ejs', html);
