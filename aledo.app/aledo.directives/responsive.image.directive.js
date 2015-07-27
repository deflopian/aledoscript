(function () {
    function ImageResponsive() {
        return {
            restrict: "A",
            scope: {
                responsiveSettings: "=imageResponsive"
            },
            link: function (scope, $image, attrs, ctrl) {
                var _options = {
                    responsive: scope.responsiveSettings,
                    sizes: []

                },
                    _ = _options,
                    $window = jQuery(window),
                    _timeout,
                    _init = function () {
                        _.node = $image[0].nodeName.toLowerCase();
                        $image.data("ResponsiveImage", {});

                        _.sizes = jQuery.map(_.responsive, function (v, k) {
                            var size = parseInt(k);
                            if (!isNaN(size)) {
                                return size;
                            }
                        });



                        _.sizes.sort(function (a, b) {
                            if (a < b) {
                                return -1;
                            }
                            if (a > b) {
                                return 1;
                            }
                            return 0;
                        });
                        _bindEvents();
                        _checkSizes();
                    },

                    _bindEvents = function () {
                        $window.on("resize.responsiveImages", function () {
                            if (_timeout) clearTimeout(_timeout);
                            _timeout = setTimeout(function () {
                                _checkSizes();
                            }, 300);
                        });
                    },
                    _checkSizes = function () {
                        var windowWidth = $window.width(),
                            availableSizes = jQuery.grep(_.sizes.slice(), function (a) {
                                return a <= windowWidth;
                            });
                        _setSizes(availableSizes);
                    },
                    _setSizes = function (availableSizes) {
                        var src, css;
                        if (!availableSizes.length) {
                               if ($image.data("ResponsiveImage")["default"]) {
                                return;
                            }
                            src = _.responsive["default"].src;
                            css = _.responsive["default"].css;
                            $image.data("ResponsiveImage", { "default": true });
                        } else {
                            src = _.responsive[availableSizes[availableSizes.length - 1]].src;
                            css = _.responsive[availableSizes[availableSizes.length - 1]].css;
							$image.data("ResponsiveImage", { "default": false });
                        }

                        if (_.node == "img") {
                            $image[0].src = src;
                        } else {
                            $image.css("background-image", "url(" + src + ")");
                        }
                        if (css) {
                            $image.css(css);
                        }
                    };
                _init();
            }
        }
    }

    angular.module('aledo.directives')
        .directive('imageResponsive', [ImageResponsive]);
})(jQuery);