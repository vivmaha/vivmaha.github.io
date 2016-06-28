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
exports.add = function(element, notifications) {
    var states = {
        completelyOutOfView : {
            detector : function(elementTop, elementBot, windowBot) {
                return elementTop > windowBot || elementBot < 0
            },
        },
        completelyInView : {
            detector : function(elementTop, elementBot, windowBot) {
                return elementTop > 0 && elementBot < windowBot;
            },
        },
        mostlyInView : {
            detector : function(elementTop, elementBot, windowBot) {
                var elementMid = (elementTop + elementBot) /2;
                return elementMid < windowBot && elementMid > 0;
            },
        },
        partiallyInView : {
            detector : function(elementTop, elementBot, windowBot) {
                function isInView(position) {
                    return position < windowBot && position > 0;
                }
                return isInView(elementTop) ^ isInView(elementBot);
            },
        },
    };

    for (var stateKey in states) {
        var state = states[stateKey];
        state.notifier = notifications[stateKey];
    }

    var throttledEventListener = require('throttled-event-listener');
    
    throttledEventListener.add('scroll', 100, function() {
        var elementClientRect = element.getBoundingClientRect(); 
        var elementTop = elementClientRect.top;
        var elementBot = elementClientRect.bottom;
        var windowBot = document.documentElement.clientHeight;
                            
        for (var stateKey in states){
            var state = states[stateKey];
            if (state.notifier) {
                var oldValue = state.value;
                var newValue = state.detector(elementTop, elementBot, windowBot);                        
                if (!oldValue && newValue) {
                    state.notifier();
                }
                state.value = newValue;                        
            }
        }
    });
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
                function OnNotification(type) {
                    $scope.notifications.unshift(type);
                    if ($scope.notifications.length > 20) {
                        $scope.notifications.pop();
                    }
                    $scope.$apply();
                }

                var clientRectNotifications = require('../../modules/client-rect-notifications');
                clientRectNotifications.add(
                    trackerElement,
                    {
                        completelyOutOfView : function() {
                            OnNotification('completelyOutOfView');
                        }, 
                        completelyInView : function() {
                            OnNotification('completelyInView');
                        },
                        mostlyInView : function() {
                            OnNotification('mostlyInView');
                        },
                        partiallyInView : function() {
                            OnNotification('partiallyInView');
                        }
                    }
                );
            }
        ]
    );

})();


},{"../../app":2,"../../modules/client-rect-notifications":3}]},{},[2,3,4]);
