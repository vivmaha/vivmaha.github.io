(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.add = function(
    type,
    timeout,
    listener,
    options // { debounce: bool, nonThrottledListener: function(event)}
) {
    var lastTime = new Date();
    if (!options) {
        options = {};
    }

    function wrappedListener(event) {
        if (options.nonThrottledListener) {
            options.nonThrottledListener(event);
        }
        var newLastTime = new Date();
        var elapsedTime = newLastTime - lastTime;
        if (options.debounce) {
            lastTime = newLastTime;
        }
        if (elapsedTime < timeout) {
            return;
        };
        lastTime = newLastTime;
        requestAnimationFrame(function () {
            listener(event);
        });
    };

    window.addEventListener(type, wrappedListener);

    return {
        end: function () {
            window.removeEventListener(type, wrappedListener);
        }
    };
};

},{}],2:[function(require,module,exports){
exports.app = angular.module('app', [
    'ngRoute',
]);

exports.app.config(['$routeProvider', '$compileProvider',
    function ($routeProvider, $compileProvider) {
        $routeProvider.when('/', {
            templateUrl: 'pages/home/home.html',
            controller: 'pageHome', 
        });
        
        $compileProvider.debugInfoEnabled(false);
    }
]);
},{}],3:[function(require,module,exports){
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
},{"throttled-event-listener":1}],4:[function(require,module,exports){
(function() {

    var app = require('../../app').app;
    app.controller(
        'pageHome', 
        [
            '$scope',
            function($scope) {
                var trackerElement = document.getElementsByClassName('tracker')[0];

                $scope.notifications = [];
                function OnNotification(amount) {
                    $scope.notifications.unshift(amount.toFixed(2));
                    if ($scope.notifications.length > 20) {
                        $scope.notifications.pop();
                    }
                    $scope.$apply();
                }

                var clientParallaxNotifications = require('../../modules/client-parallax-notifications');
                clientParallaxNotifications.add(trackerElement, OnNotification);
            }
        ]
    );

})();


},{"../../app":2,"../../modules/client-parallax-notifications":3}]},{},[2,3,4]);
