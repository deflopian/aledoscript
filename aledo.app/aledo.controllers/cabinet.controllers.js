(function ($) {
    function ChangeDataController($scope, $http) {
        $scope.submit = function () {


            $http({
                method  : 'POST',
                url     : '/cabinet/updateRegisterInfo/',
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

    function ChangePwdController($scope, $http) {
        $scope.submit = function () {
            $http({
                method  : 'POST',
                url     : '/cabinet/changepassword/',
                data    : $.param($scope.formData),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data) {
                    console.log(data);

                    if (!data.success) {
                        $scope.errorPassword = data.errors.password;
                    } else {
                        location.reload();
                    }
                });
        };
        $scope.$watch("formData.newCredential", function (oldValue, newValue) {
            if (!_checkPasswords()) {
                $scope.changePassword.$invalid = true;
            }
        });
        $scope.$watch("formData.newCredentialVerify", function (oldValue, newValue) {
            if (!_checkPasswords()) {
                $scope.changePassword.$invalid = true;
            }
        });

        function _checkPasswords() {
            return $scope.formData.newCredential == $scope.formData.newCredentialVerify;
        }
    }

    angular.module('aledo.controllers')
        .controller("ChangeDataController", ["$scope", "$http", ChangeDataController])
        .controller("ChangePwdController", ["$scope", "$http", ChangePwdController]);

})(jQuery)