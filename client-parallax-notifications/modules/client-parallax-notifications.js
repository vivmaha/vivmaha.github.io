exports.add = function (
    element,
    onParallaxChange,
    options) {

    var defaultOptions = {
        interval: 100,
        range: {
            min: 0,
            max: 1,
        },
        sensitiveRegion: {
            start: 0,
            end: 1,
        }
    };

    options = options || defaultOptions;
    options.interval = options.interval || defaultOptions.interval;
    options.range = options.range || defaultOptions.range;
    options.sensitiveRegion = options.sensitiveRegion || defaultOptions.sensitiveRegion;

    function listener($event) {
        var rect = element.getBoundingClientRect();

        var topMin = -rect.height;
        var topMax = document.documentElement.clientHeight;
        var topCur = rect.top;

        var parallaxAmount = options.range.max - options.range.min;

        var topFraction = 1 - ((topCur - topMin) / (topMax - topMin));

        if (topFraction < options.sensitiveRegion.start) {
            topFraction = options.sensitiveRegion.start;
        } else if (topFraction > options.sensitiveRegion.end) {
            topFraction = options.sensitiveRegion.end;
        };

        topFraction =
            (topFraction - options.sensitiveRegion.start) /
            (options.sensitiveRegion.end - options.sensitiveRegion.start);

        var parallax = (topFraction * parallaxAmount) + options.range.min;

        parallaxAmount = parallax;
        onParallaxChange(parallaxAmount);
    }

    var throttler = require('throttled-event-listener');
    throttler.add('scroll', options.interval,
        function ($event) {
            listener($event);            
        }
    );
};