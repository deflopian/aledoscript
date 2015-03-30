(function ($) {
    function LoginController($scope, $http) {
        $scope.formData = {};
        $scope.errorUsername = "";
        $scope.errorPassword = "";

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
                        $scope.errorUsername = data.errors.username;
                        $scope.errorPassword = data.errors.password;
                    } else {
                        location.reload();
                    }
                });
        };
    }
    angular.module('aledo.controllers').controller("LoginController", ["$scope", "$http", LoginController]);
})(jQuery)