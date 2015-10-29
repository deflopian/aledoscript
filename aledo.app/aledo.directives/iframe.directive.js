(function ($) {
    var Iframe = function() {
        return {
            restrict: 'A',
           
            link: function(scope, $iframe, attrs, ngModel) {
                var timer,
				_setWidth =  function(){
					 var newWidth = $iframe.parent().width();
                        $iframe
                            .width(newWidth)
                            .height(newWidth * $iframe.attr('data-aspectRatio'));
									};
                $iframe
                    .attr('data-aspectRatio', $iframe.height() / $iframe.width())
                    .removeAttr('height')
                    .removeAttr('width');


                angular.element(window).resize(function() {
                    if (timer) clearTimeout(timer);

                    timer = setTimeout(function() {
                       _setWidth();
                    }, 150);
                });
				_setWidth();

            }
        };
    };
   

    angular.module('aledo.directives')
    .directive('ngIframe', [Iframe]);

})(jQuery);

