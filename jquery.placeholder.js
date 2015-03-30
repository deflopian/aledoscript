(function ($) {
    function PlaceholderEmulators() {
        this.options = {
            phActiveClass: 'b-placeholdered-input__label_focused'
        };
        this.init = function (self, options) {
            jQuery.extend(this.options, options);
            var $wrapper = jQuery(self),
                options = this.options,
                _hidePlaceholder = function ($placeholder) {
                    $placeholder.hide().removeClass(options.phActiveClass);
                    return $placeholder;
                },
                _showPlaceholder = function ($placeholder, isActive) {
                    if (isActive) {
                        $placeholder.addClass(options.phActiveClass);
                    } else {
                        $placeholder.removeClass(options.phActiveClass);
                    }
                    $placeholder.show();
                    return $placeholder;
                };

            var $input = $wrapper.find('input');
            if ($input.data('placeholdered')) return;
            $wrapper.on('click', function () {
                $input.focus();
            });
            var $ph = $wrapper.find('label');
            $input.val().length && $ph.hide();
            $input.focus(function () {
                jQuery(this).val().length > 0 && _hidePlaceholder($ph) || _showPlaceholder($ph, true);
            }).blur(function () {
                jQuery(this).val().length === 0 && _showPlaceholder($ph, false);
            }).on("oninput" in $input[0] ? "input" : "propertychange", function (event) {
                //есть исключительная сит-я, когда type == propertychange, но не содержит propertyName (через trigger)
                if (event.type === "propertychange" && event.originalEvent && event.originalEvent.propertyName !== "value") {
                    return;
                }
                jQuery(this).val().length > 0 && _hidePlaceholder($ph) || _showPlaceholder($ph, true);
            });
            // В Ie 9 событие oninput не генерится на клавиши del, backspace
            if (browser.msie9) {
                $input.on("keyup", function (event) {
                    var keyCodes = [
                        8, // del
                        46// backspace
                    ];
                    if (jQuery.inArray(event.which, keyCodes) >= 0) {
                        jQuery(this).val().length > 0 && _hidePlaceholder($ph) || _showPlaceholder($ph, true);
                    }
                });
            }
            $input.data('placeholdered', true);
        };
    }

    $.fn.emulatePlaceholder = function (options) {
        return jQuery(this).each(function () {
            new PlaceholderEmulators().init(this, options);
        });
    };
})(jQuery)
