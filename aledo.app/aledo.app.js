(function () {
    angular.module('aledo.controllers', []);
    angular.module('aledo.directives', []);
    
    angular.module('Aledo', [
        'ngTouch',
        'aledo.controllers',
        'aledo.directives',
        "solo.table", "ngTouch", "myFilters"
    ]);
})();

