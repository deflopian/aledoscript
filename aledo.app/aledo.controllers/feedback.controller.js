(function($) {
    function FeedbackController($scope, $http) {
        $scope.submit = function() {
            //todo
        };
    }

    angular.module('aledo.directives').controller("FeedbackController", ["$scope", "$http", FeedbackController]);
})(jQuery)