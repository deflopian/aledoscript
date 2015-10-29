(function ($) {
    var Nav = function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, $element, attrs, ngModel) {
                var $trigger = $element.find(".b-mobile-nav__trigger"),
                $menu = $element.find(".b-mobile-nav-list"),
                $menuIcon = $element.find(".b-menu-icon");

                $trigger.on("click.toggleMobileNav", function () {
                    $element.toggleClass("b-mobile-nav_open");
                    $menuIcon.toggleClass("b-menu-icon_active");
                });
            }
        };
    };
    var Search = function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, $element, attrs, ngModel) {
                var $trigger = $element.find(".b-mobile-search__trigger"),
                $inner = $element.find(".b-mobile-search__inner"),

                _isOpened = function () {
                    return !!$element.data("form.opened");
                };







                $trigger.on("click.search", function () {

                    if (_isOpened()) {
                        $trigger.parents("form").submit();
                        return;
                    }
                    $element.toggleClass("b-mobile-search_open");
                    $element.data("form.opened", true);

                });
            }
        };
    };

    angular.module('aledo.directives').directive('ngMobileNav', [Nav])
    .directive('ngMobileSearch', [Search]);

})(jQuery);

