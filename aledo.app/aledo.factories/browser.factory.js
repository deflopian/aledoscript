(function ($) {

    var Browser = function() {
        return browser;
    };

    angular.module('aledo.factories')
        .factory('Browser', [Browser]);

})(jQuery);