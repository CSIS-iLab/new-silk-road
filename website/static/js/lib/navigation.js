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
        $('.header-nav-trigger').toggleClass('trigger-active');
        $('.header-title').toggleClass('trigger-active');
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


$(document).ready(function() {

    /*
        Version 1.3.2
        The MIT License (MIT)

        Copyright (c) 2014 Dirk Groenen

        Permission is hereby granted, free of charge, to any person obtaining a copy of
        this software and associated documentation files (the "Software"), to deal in
        the Software without restriction, including without limitation the rights to
        use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
        the Software, and to permit persons to whom the Software is furnished to do so,
        subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.
    */

    $.fn.viewportChecker = function(useroptions) {
        // Define options and extend with user
        var options = {
            classToAdd: 'visible',
            offset: 100,
            callbackFunction: function(elem) {}
        };
        $.extend(options, useroptions);

        // Cache the given element and height of the browser
        var $elem = this,
            windowHeight = $(window).height();

        this.checkElements = function() {

            // Set some vars to check with
            var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html'),
                viewportTop = $(scrollElem).scrollTop(),
                viewportBottom = (viewportTop + windowHeight);

            $elem.each(function() {
                var $obj = $(this);
                // If class already exists; quit
                if ($obj.hasClass(options.classToAdd)) {
                    return;
                }


                // define the top position of the element and include the offset which makes is appear earlier or later
                var elemTop = Math.round($obj.offset().top) + options.offset,
                    elemBottom = elemTop + ($obj.height());

                // Add class if in viewport
                if ((elemTop < viewportBottom) && (elemBottom > viewportTop)) {
                    $obj.addClass(options.classToAdd);

                    var counter = function($this) {
                        var maxNum = Math.abs(parseInt($this.text()));
                        var i = 0;
                        var repeat = maxNum / 20;

                        setInterval(function() {

                            $this.text(parseInt(i += repeat));

                            if (i > maxNum) {
                                $this.text(parseInt(maxNum));
                                return;
                            }

                        }, 60);
                    }


                    $(".large-numbers").each(function(index, element) {
                        counter($(element));
                    });

                    // Do the callback function. Callback wil send the jQuery object as parameter
                    options.callbackFunction($obj);
                }
            });
        };

        // Run checkelements on load and scroll
        $(window).scroll(this.checkElements);
        this.checkElements();

        // On resize change the height var
        $(window).resize(function(e) {
            windowHeight = e.currentTarget.innerHeight;
        });

    };



    $('#db-summary').addClass("").viewportChecker({
        classToAdd: 'count-num', // Class to add to the elements when they are visible
        offset: 100
    });

});
