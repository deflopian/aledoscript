(function ($) {
    var NgEnter = function () {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if(event.which === 13) {
                        scope.$apply(function (){
                            scope.$eval(attrs.ngEnter);
                        });

                        event.preventDefault();
                    }
                });
            }
        };
    };

    angular.module('aledo.directives').directive('ngEnter', [NgEnter]);
})(jQuery)
