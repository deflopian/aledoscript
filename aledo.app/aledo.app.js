(function () {
    angular.module('aledo.services', []);
    angular.module('aledo.controllers', []);
    angular.module('aledo.directives', []);
    
    angular.module('Aledo', [
        'ngTouch',
        'aledo.controllers',
        'aledo.services',
        'aledo.directives',
        "solo.table", "ngTouch", "myFilters"
    ]);
    angular.module('Aledo')
        .config(function($locationProvider) {
            $locationProvider.html5Mode(false);
            console.log($locationProvider.hashPrefix());
    });
})();

