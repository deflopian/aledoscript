(function () {
    var GeoWidget = function (CookieFactory, $http) {
        return {
            restrict: 'A',

            link: function (scope, $widget, attrs, ctrl) {
                var $widgetContent = $widget.find(".b-geo-widget__content"),
                    $closeButton = $widget.find(".b-geo-widget__close"),
					$sectionType = $widget.data("section-type"),
					$sectionId = $widget.data("section-id"),
                    openClass = "b-geo-widget_open";

                var _closeWidget = function() {
                        $widget.removeClass(openClass);
                    },
                    _openWidget = function() {
                        $widget.addClass(openClass);
                    };
                
                $http({
						url: '/geobanners/get/',
						method: 'POST',
						headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
						data: $.param({'section_type': $sectionType, 'section_id': $sectionId})
					}).then(function(response) {
						if (response.data.text != null) {
							if (response.data.link != null && response.data.link != '') {
								$widgetContent.html('<a href="' + response.data.link + '" style="text-decoration: none;" target="_blank">' + response.data.text + '</a>');
							}
							else $widgetContent.html(response.data.text);
							_openWidget();
						}
					});
                $closeButton.on("click.geowidget", function() {
                    _closeWidget();
                });
            }
        };
    };
    angular.module('aledo.directives').directive('ngGeoWidget', ['CookieFactory', '$http', GeoWidget]);
})();