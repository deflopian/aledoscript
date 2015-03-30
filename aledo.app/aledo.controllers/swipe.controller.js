(function ($) {
    function SwipeController($scope) {
        var $document = jQuery(document);
        $scope.swipe = function (dir) {
            $document.trigger("ng.swipe." + dir);
        }
    }
    angular.module('aledo.controllers').controller("SwipeController", ["$scope", "$http", SwipeController]);
})(jQuery)