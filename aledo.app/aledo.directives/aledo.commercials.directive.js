(function ($) {
    var aledoCommercials = function () {
        return {
            restrict: 'E',
            controller: 'CommercialsController',
            link: function (scope, el, attrs, ctrl) {
                console.log(scope);
                console.log(ctrl);
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
    var aledoCommercialsData = function(){
        return {
            restrict: "E",
            link: function (scope, elm, attrs, ngm)
            {
                //elm.hide();
                elm.css({"display" : "none"});

                var json = angular.fromJson(elm.html());
                scope.bindData(json);

            }
        };
    };
    var aledoCommercialProdsData = function(){
        return {
            restrict: "E",
            controller: 'CommercialsController',
            link: function (scope, elm, attrs, ngm)
            {
                //elm.hide();
                elm.css({"display" : "none"});

                var json = angular.fromJson(elm.html());
                scope.prodsInRoom = json;
                console.log(scope);

            }
        };
    };

    angular.module('aledo.directives').directive('aledoCommercials', [aledoCommercials]);
    angular.module('aledo.directives').directive('aledoCommercialsData', [aledoCommercialsData]);
    angular.module('aledo.directives').directive('aledoCommercialProdsData', [aledoCommercialProdsData]);
})(jQuery)
