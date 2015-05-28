(function($) {
    function FeedbackController($scope, $http) {
        $scope.formData = {};
        $scope.submit = function () {
            $http({
                method  : 'POST',
                url     : '/info/feedback/',
                data    : $.param($scope.formData),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data) {
                    if (!data.success) {
                    } else {
                        $scope.getPopup($scope.ALEDO_POPUP_SUCCESS, {});
                    }
                });
        };
    }

    angular.module('aledo.directives').controller("FeedbackController", ["$scope", "$http", FeedbackController]);
})(jQuery)