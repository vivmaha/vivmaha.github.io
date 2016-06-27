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

    var throttledEventListener = require('./throttled-event-listener');
    
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