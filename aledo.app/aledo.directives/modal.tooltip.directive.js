(function ($) {
    
    angular.module('aledo.directives').directive('ngModalTooltip', function () {
            return {
                scope: {
                    settings: "=ngModalTooltip"
                },
                link: function (scope, $modal, attr, ctrl) {
                    var $target = jQuery(scope.settings.target),
                        $modal = jQuery($modal),
                        $targetLast = null,
                        $window = jQuery(window),
						$document = jQuery(document),
                        $modalArrow = $modal.find(".b-modal-tooltip__arrow"),
                        $close = $modal.find(".b-modal-tooltip__close"),
                     _close = function () {
                         $modal.hide();
                         $targetLast = null;
                     },
                     _setPosition = function () {
                         $modal.position(jQuery.extend({
                             of: $targetLast,
                             at: "left-30 top-20",
                             my: "left bottom",
                             collision: "fit none",
                             using: function (props, feedback) {
                                 $modal.css(props);
                                 $modalArrow.css("left", feedback.target.left - feedback.element.left + "px");
                             }

                         }, scope.settings.position || {}));
                     };
                    $close.on("click", function () {
                        _close();
                    })
                       
                    $target.on(scope.settings.events || "click", function (e) {
                        $targetLast = jQuery(this);
                        $modal.show();
                        _setPosition();
					
                    });
					
					$document.on("click.modal.tooltip", function(e){
						var $target = jQuery(e.target);
						if($target.closest(scope.settings.target).length || $target.closest($modal).length ) return;
						 _close();
					});
                    $window.on("resize.tooltip.helper", function () {
                        _setPosition();
                    });
                  
                }
            }
        });
})(jQuery)


