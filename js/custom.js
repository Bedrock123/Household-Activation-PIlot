// Masrony Init/Config 
// Reinilizes the Masontry Grid 3 & 5 seconds to ensure images are included into grid properly 
$('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
});
window.setTimeout(function() {
    $('.grid').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true

    });
}, 3000);
window.setTimeout(function() {
    $('.grid').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true

    });
}, 5000);

// Makes Confetti Dissapear 12 seconds after load
window.setTimeout(function() {
    $('#confetti').fadeOut("slow");
}, 2000);

if ($(window).width() < 800) {
    $('#confetti').fadeOut("slow");
}
$(function() {
    $("#typedJS").typed({
        strings: [
            "^500 to over <span class='grid-text-content-bold'>110</span> full length Harry Potter And The Sorceors Stone books!",
            "^500 to over <span class='grid-text-content-bold'>2,410</span> Nacey Drew commic books!",
            "^500 to over <span class='grid-text-content-bold'>50</span> readings of the Dictionary",
            "^500 to over <span class='grid-text-content-bold'>1,010</span> readings of Moby Dick"
        ],
        typeSpeed: 0,
        startDelay: 500,
        backDelay: 4000,
        loop: true,
        shuffle: true,
    });

    $("#ctaTypedJS").typed({
        strings: [
            "^500 the gift of reading.",

        ],
        typeSpeed: 0,
        startDelay: 500,
        backDelay: 4000,
        loop: true,
    });
});