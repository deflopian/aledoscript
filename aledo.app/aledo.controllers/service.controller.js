(function ($) {
    function CalculationServiceController($scope, $http) {
        $scope.submit = function () {
            var fd = new FormData();

            for (var j in $scope.formData) {
                fd.append(j, $scope.formData[j]);
            }

            $http.post('/services/saveFormAjax/', fd, {
                transformRequest: angular.identity,
                headers : { 'Content-Type': undefined }
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


        $scope.showFileName = function(input) {
            console.log(input);
            var $this = jQuery(input),
                val = $this.val().split('\\'),
                fileName = val[val.length - 1];
            $scope.$apply(function() {
                $scope.fileName = fileName;
                $scope.formData.fileName = input;
            });


        };
        $scope.resetFile = function() {
            var $fileParent = jQuery("#orderDetails").parent();
            $fileParent.replaceWith($fileParent.clone(true));
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.fileName = "";
                });
            }, 0);
        };

        $scope.updateFile = function() {

        }
    }
    angular.module('aledo.controllers').controller("CalculationServiceController", ["$scope", "$http", CalculationServiceController]);
})(jQuery)