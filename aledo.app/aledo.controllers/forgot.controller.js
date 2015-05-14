(function ($) {
    function ForgotPasswordController($scope, $http) {
        $scope.formData = {};
        $scope.errorUsername = "";
        $scope.errorPassword = "";

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
                        $scope.errorIdentity = data.errors.username;
                    } else {
                        $scope.closePopup();
                    }
                });
        };
    }
    angular.module('aledo.controllers').controller("ForgotPasswordController", ["$scope", "$http", ForgotPasswordController]);
})(jQuery)