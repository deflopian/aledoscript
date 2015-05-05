(function ($) {
    function RegistrationController($scope, $http) {
        $scope.formData = {};
        $scope.submit = function () {
            $http({
                method  : 'POST',
                url     : '/cabinet/register/',
                data    : $.param($scope.formData),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data) {
                    console.log(data);

                    if (!data.success) {
                        $scope.errorUsername = data.errors.username;
                        $scope.errorPassword = data.errors.password;
                    } else {
                        location.reload();
                    }
                });
        };
    }
    angular.module('aledo.controllers').controller("RegistrationController", ["$scope", "$http", RegistrationController]);
})(jQuery)