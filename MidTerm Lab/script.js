var autoTimer;
var totalSlides = $("#mySlider .box").length;

$("#mySlider").slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: false,
    speed: 500,
    responsive: [
        {
            breakpoint: 1024,
            settings: { slidesToShow: 3 }
        },
        {
            breakpoint: 900,
            settings: { slidesToShow: 2 }
        },
        {
            breakpoint: 480,
            settings: { slidesToShow: 1 }
        }
    ]
});

$("#mySlider").on("afterChange", function(e, slick, currentSlide) {
    var showing = currentSlide + 1;
    $(".slideCounter").text("Showing " + showing + " of " + totalSlides);
});

$(".prevBtn").click(function() {
    $("#mySlider").slick("slickPrev");
});

$(".nextBtn").click(function() {
    $("#mySlider").slick("slickNext");
});

function startAuto() {
    autoTimer = setInterval(function() {
        $("#mySlider").slick("slickNext");
    }, 5000);
}

function stopAuto() {
    clearInterval(autoTimer);
}

startAuto();

// AI-Enhanced Feature: pause on hover, resume on leave
// Using .carouselSection + .slick-slide so cloned cards are also covered
$(".carouselSection").on("mouseenter", ".slick-slide", function() {
    stopAuto();
});

$(".carouselSection").on("mouseleave", ".slick-slide", function() {
    startAuto();
});