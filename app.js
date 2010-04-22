var jQT = new $.jQTouch({
    'statusBar': 'black',
    'icon': 'touch-icon.png'
});

$(document).ready(function() {
    $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20link%2C%20comments%2C%20pubDate%2C%20description%20from%20feed%20where%20url%3D'http%3A%2F%2Fcargocollective.com%2Ffeed-rss.php%3Furl%3Dlearnsomethingeveryday'&format=json&callback=?", function(data) {
        $.each(data.query.results.item, function(i) {
            var panelId = this.link.substr(this.link.lastIndexOf('/')+1).toLowerCase();
            var $panel = $('#template').clone(true);
            $panel.attr('id', panelId);
            $('.content', $panel).html(this.description.substr(0, this.description.indexOf('>')+1));
            $('#jqt').append($panel);
            $('img', $panel).load(function() {
                var $bg = $(this).parents('.day').find('.background');
                $bg.css('border-width','500px').css('-webkit-border-image', 'url(' + $(this).attr('src') + ') 1 1 1 1');
                if (i === 0) jQT.goTo('.day:first', 'slide');
            });
        });
        $('#template').remove();
    });
    
    
    var swipeActive = false;
    var swipeStartX = null;
    var swipeStartY = null;
    var swipeEndX = null;
    var swipeEndY = null;
    $('.day').live('touchstart', function(e) {
        var eo = e.originalEvent;
        if (eo.targetTouches.length == 1) swipeActive = true;
        else swipeActive = false;
        swipeStartX = eo.targetTouches[0].pageX; 
        swipeStartY = eo.targetTouches[0].pageY;
    }).live('touchmove', function(e) {
        var eo = e.originalEvent;
        if (eo.targetTouches.length == 1) swipeActive = true;
        else swipeActive = false;
        swipeEndX = eo.targetTouches[0].pageX; 
        swipeEndY = eo.targetTouches[0].pageY;
        e.preventDefault();
        e.stopPropagation();
    }).live('touchend', function(e) {
        if (swipeActive && (Math.abs(swipeEndX - swipeStartX) > 50) && (Math.abs(swipeEndY - swipeStartY) < 50)) {
            var direction = (swipeEndX > swipeStartX) ? 'right' : 'left';
            var nextPanel;
            if (direction == 'left') {
                nextPanel = $(this).next('.day');
                if (!nextPanel.length) nextPanel = $(this).parent().children('.day').first();
            } else if (direction == 'right') {
                nextPanel = $(this).prev('.day');
                if (!nextPanel.length) nextPanel = $(this).parent().children('.day').last();
            }
            jQT.goTo(nextPanel, 'slide', direction == 'right');
        }
        swipeActive = false;
        swipeStartX = null;
        swipeStartY = null;
        swipeEndX = null;
        swipeEndY = null;
    });
});
