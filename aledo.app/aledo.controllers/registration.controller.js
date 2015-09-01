(function ($) {
    function RegistrationController($scope, $http) {
        $scope.formData = {};
        $scope.validityOnChange = function(field) {
            if ($scope.registration[field].$invalid) {
                $scope.registration[field].$invalid = false;
            }

            for (var f in $scope.formData) {
                console.log(f, $scope.registration[f]);
                if ($scope.registration[f] && ($scope.registration[f].$pristine || $scope.registration[f].$invalid)) {
                    return false;
                }
            }

            $scope.registration.$invalid = false;
        };
        $scope.submit = function () {
			$http({
                method  : 'POST',
                url     : '/cabinet/register/',
                data    : $.param($scope.formData),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data) {
                    if (!data.success) {
                        for (var field in data.errors) {
                            for (var errNum in data.errors[field]) {

                                $scope.registration[field].$setValidity(errNum, false);
                            }
                        }
                    } else {
                        $scope.getPopup($scope.ALEDO_POPUP_REGISTER_SUCCESS, {email: $scope.formData.user_email, name: $scope.formData.user_name});
                    }
                });
        };
    }
    angular.module('aledo.controllers').controller("RegistrationController", ["$scope", "$http", RegistrationController]);
})(jQuery)