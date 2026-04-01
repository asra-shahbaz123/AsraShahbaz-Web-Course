var menuOpen = false;

var burger = document.getElementById("burgerBtn");
var nav = document.getElementById("navLinks");

burger.addEventListener("click", function() {
    if (menuOpen == false) {
        nav.style.display = "flex";
        menuOpen = true;
        burger.innerHTML = "&#10005;";
    } else {
        nav.style.display = "none";
        menuOpen = false;
        burger.innerHTML = "&#9776;";
    }
});

var links = document.querySelectorAll(".navLinks a, .navLinks div");
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function() {
        if (window.innerWidth <= 768) {
            nav.style.display = "none";
            menuOpen = false;
            burger.innerHTML = "&#9776;";
        }
    });
}