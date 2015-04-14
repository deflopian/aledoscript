(function ($) {
    function PopupController($scope, $http, $location) {
        $scope.ALEDO_POPUP_ERROR = 0;
        $scope.ALEDO_POPUP_SUCCESS = 1;
        $scope.ALEDO_POPUP_LOGIN = 2;
        $scope.ALEDO_POPUP_REGISTER = 3;
        $scope.ALEDO_POPUP_CART_BUY = 4;
        $scope.ALEDO_POPUP_CART_BUY_WITHOUT_REGISTER = 5;
        $scope.ALEDO_POPUP_CART_REGISTER = 6;
        $scope.ALEDO_POPUP_REGISTER_SUCCESS = 7;
        $scope.ALEDO_POPUP_CART_REGISTER_SUCCESS = 8;
        $scope.ALEDO_POPUP_PARTNER_CARD = 9;


        $scope.cache = "";

        $scope.getPopup = function(popupType, parameters) {
            $http({
                method  : 'POST',
                url     : '/app/showFooBarPopup/',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data : {'type': popupType, 'url': $location.href, 'params': parameters}
            })
            .success(function(data) {
                    if(data.success){
                        var modal = $('#fooBarPopup');
                        modal.find('.modal-content').html(data.content);

                        if(popupType == $scope.ALEDO_POPUP_CART_BUY || popupType == $scope.ALEDO_POPUP_CART_BUY_WITHOUT_REGISTER){
                            modal.addClass('cart-buy-popup');
                        } else {
                            modal.removeClass('cart-buy-popup');
                        }

                        if(popupType == $scope.ALEDO_POPUP_REGISTER_SUCCESS){
                            modal.on('hidden.bs.modal', function () { location.reload(true); });
                        }

                        modal.modal('show');
                    }
            });
        }
    }
    angular.module('aledo.controllers').controller("PopupController", ["$scope", "$http", "$location", PopupController]);

})(jQuery)