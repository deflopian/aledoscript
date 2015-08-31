(function ($) {
    function JobController($scope, $http) {
        $scope.formData = {};
		
        $scope.submit = function () {
			$scope.nameError = false;
			$scope.mailError = false;
			$scope.vacancyError = false;
			$scope.fileError = false;
            $scope.phoneError = false;
		
            var fd = new FormData();

            for (var j in $scope.formData) {
                fd.append(j, $scope.formData[j]);
            }

            $http.post('/vacancies/saveFormAjax/', fd, {
                transformRequest: angular.identity,
                headers : { 'Content-Type': undefined }
            })
                .success(function(data) {
                    console.log(data);

                    if (!data.success) {
						if (data.messages.name) $scope.nameError = true;						
						if (data.messages.mail) $scope.mailError = true;
						if (data.messages.file) $scope.fileError = true;
						if (data.messages.letter) $scope.letterError = true;
                        if ($scope.formData['vacancy'] && data.messages.phone) $scope.phoneError = true;
                    } else {
						$scope.getPopup($scope.ALEDO_POPUP_VACANCY_REQUEST_SUCCESS, $scope.formData.name);
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
            var $fileParent = jQuery("#jobDetails").parent();
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
    angular.module('aledo.controllers').controller("JobController", ["$scope", "$http", JobController]);
})(jQuery)