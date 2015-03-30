(function ($) {
    function ChangeDataController($scope, $http) {
        $scope.submit = function () {
            //todo
        };
    }

    function ChangePwdController($scope, $http) {
        $scope.submit = function () {
            //todo
        };
        $scope.$watch("change_pwd_new_password", function (oldValue, newValue) {
            if (!_checkPasswords()) {
                $scope.changePassword.$invalid = true;
            }
        });
        $scope.$watch("change_pwd_new_password_repeat", function (oldValue, newValue) {

        });

        function _checkPasswords() {
            //return $scope.change_pwd_new_password == $scope.change_pwd_new_password;
        }
    }

    angular.module('aledo.controllers')
        .controller("ChangeDataController", ["$scope", "$http", ChangeDataController])
        .controller("ChangePwdController", ["$scope", "$http", ChangePwdController]);

})(jQuery)