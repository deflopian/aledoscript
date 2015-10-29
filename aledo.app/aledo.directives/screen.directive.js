(function ($) {

    var Screen = function(browser) {
        return {
            link: function(scope, $element, attrs, controller) {
                var $xs = $element.find(".visible-xs"),
                    $sm = $element.find(".visible-sm"),
                    $md = $element.find(".visible-md"),
                    $lg = $element.find(".visible-lg"),
                    $window = angular.element(window),
                    

                _updateBrowserInfo = function() {
                    browser.screen.xs = $xs.is(":visible");
                    browser.screen.sm = $sm.is(":visible");
                    browser.screen.md = $md.is(":visible");
                    browser.screen.lg = $lg.is(":visible");
                    };
                browser.screen = {};
                
                $window.on("resize.browser.screen", function() {
                    _updateBrowserInfo();
                });
                _updateBrowserInfo();

            }
        };
    };


    angular.module('aledo.directives')
        .directive('ngScreenHelper', ['Browser', Screen]);

})(jQuery);