(function ($) {
    function JobController($scope, $http) {
        $scope.formData = {};
		
        $scope.submit = function () {
			$scope.nameError = false;
			$scope.mailError = false;
			$scope.fileError = false;
		
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