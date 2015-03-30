(function ($) {
    var InputMask = function () {
        return {
            restrict: 'A',
            require: 'ngModel',

            link: function (scope, el, attrs, ctrl) {
                var modelName = attrs.ngModel;
                el.mask(attrs.inputMask, {
                    completed: function () {
                        scope.$apply(function () {
                            ctrl.$setViewValue(el.val(), modelName);
                            ctrl.$setValidity(modelName, true);
                        });
                    }
                });
            }
        };
    };

    angular.module('aledo.directives').directive('inputMask', [InputMask]);
})(jQuery)
