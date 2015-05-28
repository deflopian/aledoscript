(function ($) {
    function ChangeDataController($scope, $http) {
        $scope.formData = {};
        $scope.validityOnChange = function(field) {
            if ($scope.changeData[field].$invalid) {
                $scope.changeData[field].$invalid = false;
            }

            for (var f in $scope.formData) {
                console.log(f, $scope.changeData[f]);
                if ($scope.changeData[f] && ($scope.changeData[f].$pristine || $scope.changeData[f].$invalid)) {
                    return false;
                }
            }

            $scope.changeData.$invalid = false;
        };
        $scope.submit = function () {


            $http({
                method  : 'POST',
                url     : '/cabinet/updateRegisterInfo/',
                data    : $.param($scope.formData),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data) {
                    if (!data.success) {
                        if (data.messages) {
                            for (var field in data.messages) {
                                for (var errNum in data.messages[field]) {
                                    $scope.changeData[field].$setValidity(errNum, false);
                                }
                            }
                        }
                    } else {
                        location.reload();
                    }
                });
        };
    }

    function ChangePwdController($scope, $http) {
        $scope.formData = {};
        $scope.validityOnChange = function(field) {
            if ($scope.changePassword[field].$invalid) {
                $scope.changePassword[field].$invalid = false;
            }

            for (var f in $scope.formData) {
                console.log(f, $scope.changePassword[f]);
                if ($scope.changePassword[f] && ($scope.changePassword[f].$pristine || $scope.changePassword[f].$invalid)) {
                    return false;
                }
            }

            $scope.changePassword.$invalid = false;
        };
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
                        if (data.messages) {
                            for (var field in data.messages) {
                                for (var errNum in data.messages[field]) {
                                    $scope.changePassword[field].$setValidity(errNum, false);
                                }
                            }
                        }
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