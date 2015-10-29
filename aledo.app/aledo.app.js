(function () {
    angular.module('aledo.services', []);
	angular.module('aledo.factories', []);
    angular.module('aledo.controllers', []);
    angular.module('aledo.directives', []);
	
    
    angular.module('Aledo', [
        'ngTouch',
        'aledo.controllers',
        'aledo.services',
        'aledo.directives',
		'aledo.factories',
        "solo.table", "ngTouch", "myFilters", 'angular-sortable-view'
    ]);
    angular.module('Aledo')
        .config(function($locationProvider) {
            $locationProvider.html5Mode(false);
            console.log($locationProvider.hashPrefix());
    });
    angular.module('Aledo')
        .factory('CookieFactory', function($q, $timeout){

            return {
                getCookie: function(name){
                    var deferred = $q.defer();

                    $timeout(function() {
                        deferred.resolve($.cookie(name));
                    }, 0);
                    var data = {};
                    return deferred.promise;

                },

                getAllCookies: function(){
                    return $.cookie();
                },

                setCookie: function(name, value, options){
					
					return $.cookie(name, value, jQuery.extend({ expires: 7, path: '/' }, options || {}));
                },

                deleteCookie: function(name){
                    return $.removeCookie(name);
                }
            }
    });
})();

