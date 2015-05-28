(function ($) {
    function ForgotPasswordController($scope, $http) {
        $scope.formData = {};
        $scope.userNotFound = false;

        $scope.submit = function() {
            $http({
                method  : 'POST',
                url     : '/cabinet/forgot/',
                data    : $.param($scope.formData),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data) {
                    console.log(data);

                    if (!data.success) {
                        $scope.userNotFound = true;
                    } else {
                        $scope.closePopup();
                    }
                });
        };
    }
    angular.module('aledo.controllers').controller("ForgotPasswordController", ["$scope", "$http", ForgotPasswordController]);
})(jQuery)