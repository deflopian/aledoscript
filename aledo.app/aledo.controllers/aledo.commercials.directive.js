(function ($) {
    var AledoCommercials = function () {
        return {
            restrict: 'E',
            controller: 'CommercialsController',
            link: function (scope, el, attrs, ctrl) {
            }
        };
    };

    /**
     * Эта директива добавляет данные в таблицу
     *
     * Пример:
     * <div solo-table-data>
     * [{"id":0,"prefix":"Miss","name":"Alvah Gleason","address":"58707 Ophelia Field\nEast Lorena, LA 89754-9301"}]
     * </div>
     */
    var AledoCommercialsData = function(){
        return {
            restrict: "A",
            link: function (scope, elm, attrs, ngm)
            {
                //elm.hide();
                elm.css({"display" : "none"});

                var json = angular.fromJson(elm.html());
                scope.bindData(json);

            }
        };
    };

    angular.module('aledo.directives').directive('AledoCommercials', []);
    angular.module('aledo.directives').directive('AledoCommercialsData', []);
})(jQuery)
