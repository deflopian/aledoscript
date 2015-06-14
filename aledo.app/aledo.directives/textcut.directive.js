(function () {
    var TextCut = function () {
        return {
            restrict: 'A',

            link: function (scope, $element, attrs, ctrl) {
                var options = scope.$eval(attrs.textCut), lineHeight = parseInt($element.css('line-height')),
                    $text = options.text ? $element.find(options.text) : $element;
                while ($element[0].clientHeight > lineHeight * options.lines) {
                    $text.html($text.html().replace(/\s*\S+\s*$/, '...'));
                }
            }
        };
    };
    angular.module('aledo.directives').directive('textCut', [TextCut]);
})();