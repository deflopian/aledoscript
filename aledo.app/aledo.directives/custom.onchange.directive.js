(function ($) {
    var CustomOnChange = function() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                console.log(scope, attrs);
                var onChangeFunc = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeFunc);
            }
        };
    };

    angular.module('aledo.directives').directive('customOnChange', [CustomOnChange]);
})(jQuery)
