(function () {
    var GeoWidget = function (CookieFactory, $http) {
        return {
            restrict: 'A',

            link: function (scope, $widget, attrs, ctrl) {
                return;
                var $widgetContent = $widget.find(".b-geo-widget__content"),
                    $closeButton = $widget.find(".b-geo-widget__close"),
                    openClass = "b-geo-widget_open";

                var _closeWidget = function() {
                        $widget.removeClass(openClass);
                    },
                    _openWidget = function() {
                        $widget.addClass(openClass);
                    };
                CookieFactory.getCookie("geo.widget.close").then(function(cookie) {
                    if (cookie) return;
                    $http({ url: "/", method: "GET" }).then(function(data) {
                        $widgetContent.html(data);
                        _openWidget();
                    });
                    $closeButton.on("click.geowidget", function() {
                        CookieFactory.setCookie("geo.widget.close", 1, { expires: 2 });
                        _closeWidget();
                    });
                });
            }
        };
    };
    angular.module('aledo.directives').directive('ngGeoWidget', ['CookieFactory', '$http', GeoWidget]);
})();