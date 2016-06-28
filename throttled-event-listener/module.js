(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function() {

    var app = require('../../app').app;
    app.controller(
        'pageHome', 
        [
            '$scope',
            function($scope) {
                $scope.inputs = [];
                $scope.throttled = [];
                $scope.streams = [ {
                    name : 'input',
                    data : [],
                }, {
                    name : 'throttled',
                    data : [],
                }, {
                    name : 'debounced',
                    data : [],
                }, ];

                function fire(streamIndex) {
                    $scope.streams[streamIndex].data.push({});
                    $scope.$apply();
                }

                window.addEventListener('mousedown', function(ev) {
                    fire(0);
                });

                var throttler = require('../../modules/throttled-event-listener');
                throttler.add(
                    'mousedown',
                    1000,
                    function() {
                        fire(1);
                    }
                );
                throttler.add(
                    'mousedown',
                    1000,
                    function() {
                        fire(2);
                    }, {
                        debounce : true,
                    }
                );

            }
        ]
    );

})();


},{"../../app":1,"../../modules/throttled-event-listener":2}]},{},[1,2,3]);
