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

