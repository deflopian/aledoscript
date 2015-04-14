
(function($) {
    function OrderPlaceController($scope, $http) {
        $scope.fileName = "";
        $scope.cartCookieName = "products_in_cart";
        $scope.products = [];

        $scope.showFileName = function(input) {
            var $this = jQuery(input),
                val = $this.val().split('\\'),
                fileName = val[val.length - 1];
            $scope.$apply(function() {
                $scope.fileName = fileName;
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
        }

        $scope.submit = function() {
            //todo
        };
    }
    angular.module('aledo.directives').controller("OrderPlaceController", ["$scope", "$http", OrderPlaceController]);
})(jQuery)