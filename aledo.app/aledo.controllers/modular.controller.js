(function ($) {
    function Modular($scope, $http) {
       this.activeColor = null;
    }
    angular.module('aledo.controllers').controller("ModularController", [Modular]);
})(jQuery)