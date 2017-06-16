$(document).ready(function() {




    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('body').addClass('scrolled');
        } else {
            $('body').removeClass('scrolled');
        }
    });

    $('.search-trigger, .box-search .bt-close').click(function() {
        $('body').toggleClass('search-active');
    });
    $(document).click(function(e) {
        $('body').removeClass('nav-active');
    });

    $('.nav-main').click(function(e) {
        e.stopPropagation();
    });

    $('.header-nav-trigger, .nav-main .bt-close').click(function(e) {
        e.stopPropagation();
        $('body').toggleClass('nav-active');

    });

    $('li.dropdown > span').click(function() {
        $(this).siblings('ul').slideToggle(350);
        $(this).parent().toggleClass('child-active');
    });

    $('.full-width-banner').mousemove(function(e) {
        var xPos = -(e.pageX / 8);
        var yPos = -(e.pageY / 8);
        $(this).css('background-position', xPos + 'px ' + yPos + 'px');
    });



});



