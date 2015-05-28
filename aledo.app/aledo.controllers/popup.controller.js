(function ($) {
    function PopupController($scope, $http, $location, $compile) {
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
        $scope.ALEDO_POPUP_SERVICE_CALCULATE = 10;
        $scope.ALEDO_POPUP_FORGOT = 11;
        $scope.ALEDO_POPUP_ORDER_SUCCESS = 12;
        $scope.ALEDO_POPUP_QUESTION_SUCCESS = 13;
        $scope.formData = {};

        $scope.cache = "";
        $scope.history = [];
        $scope.source = "";

        $scope.getPopupData = function(popupType, parameters) {
            $http({
                method  : 'POST',
                url     : '/app/showFooBarPopup/',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data : {'type': popupType, 'url': $location.href, 'params': parameters}
            })
                .success(function(data) {
                    if(data.success){
                        var modal = $('#fooBarPopup');
                        modal.find('.modal-content').removeClass("popup-service popup-register popup-cart-buy popup-cart-buy-without-register");
                        //modal.find('.modal-content').html(data.content);


                        if(popupType == $scope.ALEDO_POPUP_CART_BUY || popupType == $scope.ALEDO_POPUP_CART_BUY_WITHOUT_REGISTER){
                            modal.addClass('cart-buy-popup');
                        } else {
                            modal.removeClass('cart-buy-popup');
                        }



                        if(popupType == $scope.ALEDO_POPUP_REGISTER_SUCCESS){
                            modal.on('hidden.bs.modal', function () { location.reload(true); });
                        }
                        if (popupType == $scope.ALEDO_POPUP_SERVICE_CALCULATE || popupType == $scope.ALEDO_POPUP_CART_REGISTER) {
                            modal.find('.modal-content').addClass("popup-service");
                        }
                        //modal.modal('show');
                        $scope.source = data.content;
                        modal.find('.modal-content').html($scope.source);

                        // compile the new DOM and link it to the current
                        // scope.
                        // NOTE: we only compile .childNodes so that
                        // we don't get into infinite loop compiling ourselves
                        $compile(modal.find('.modal-content').contents())($scope);
                        modal.modal('show');
                        //$scope.$eval(attrs.compile);
                        //$scope.$apply();
                    }
                });
        };

        $scope.checkDefaultPopup = function() {
            var params = $location.search();
            if (params['popup']) {
                $scope.getPopup(params['popup'], {});
            }
        };

        $scope.getPopup = function(popupType, parameters, parentPopupType, parentData) {
            console.log(parentPopupType, parentData);
            console.log($scope.history);
            if (parentPopupType) {
                $scope.history.push({
                    'type' : parentPopupType,
                    'formData' : parentData
                })
            }
            $scope.getPopupData(popupType, parameters);
        };

        $scope.closePopup = function() {
            var modal = $('#fooBarPopup');
            modal.modal('hide');
        };

        $scope.popupHistoryBack = function() {
            console.log($scope);
            if ($scope.$parent.history.length > 0) {
                $scope.getPopupData($scope.$parent.history[$scope.$parent.history.length-1].type);
                $scope.formData = $scope.$parent.history[$scope.$parent.history.length-1].formData;
            }
        }

    }
    angular.module('aledo.controllers').controller("PopupController", ["$scope", "$http", "$location", "$compile", PopupController]);

})(jQuery)