(function ($) {
    function LoginController($scope, $http) {
        $scope.formData = {};
        $scope.loginError = false;
        $scope.submit = function() {
            $http({
                method  : 'POST',
                url     : '/cabinet/login/',
                data    : $.param($scope.formData),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data) {
                    console.log(data);

                    if (!data.success) {
                        $scope.loginError = true;
                    } else {
                        location.reload();
                    }
                });
        };
    }
    angular.module('aledo.controllers').controller("LoginController", ["$scope", "$http", LoginController]);
})(jQuery)