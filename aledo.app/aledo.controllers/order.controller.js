
(function($) {
    function OrderPlaceController($scope, $http, cartService) {
        $scope.fileName = "";
        $scope.cartCookieName = "products_in_cart";
        $scope.products = [];

        $scope.showFileName = function(input) {
            var $this = jQuery(input),
                val = $this.val().split('\\'),
                fileName = val[val.length - 1];
            $scope.$apply(function() {
                $scope.fileName = fileName;
            });


        };
        $scope.resetFile = function() {
            var $fileParent = jQuery("#orderDetails").parent();
            $fileParent.replaceWith($fileParent.clone(true));
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.fileName = "";
                });
            }, 0);
        };

        $scope.formData = {};

        $scope.setOrderInfo = function(orderInfo) {
            console.log(orderInfo);
            cartService.setOrderInfo(orderInfo);
        };
        $scope.getOrderInfo = function() {
            $scope.orderInfo = cartService.getOrderInfo();
            return $scope.orderInfo;
        };

        $scope.setUserInfo = function(userInfo) {
            cartService.setUserInfo(userInfo);
        };
        $scope.getUserInfo = function() {
            $scope.userInfo = cartService.getUserInfo();
            return $scope.userInfo
        };

        $scope.setProdsInfo = function(userInfo) {
            cartService.setProdsInfo(userInfo);
        };
        $scope.getProdsInfo = function() {
            $scope.prodsInfo = cartService.getProdsInfo();
            return $scope.prodsInfo;
        };

        $scope.$watch('userInfo', function(newVal) {
            $scope.setUserInfo(newVal);
        });
        $scope.$watch('prodsInfo', function(newVal) {
            $scope.setProdsInfo(newVal);
        });
        $scope.$watch('orderInfo', function(newVal) {
            $scope.setOrderInfo(newVal);
        });

        $scope.makeOrder = function(userInfo) {

            $scope.orderInfo = $scope.getOrderInfo();
            console.log($scope.orderInfo);

            $scope.setUserInfo(userInfo);
            for (var k in $scope.orderInfo) {
                if ($scope.orderInfo.hasOwnProperty(k)) {
                    userInfo[k] = $scope.orderInfo[k];
                }

            }
            if ($scope.orderInfo.order_file) {
                userInfo['order_file'] = $scope.orderInfo.order_file;
            }

            //$scope.userInfo.concat($scope.orderInfo);
            userInfo['order-products'] = JSON.stringify(cartService.getProdsInfo());
            var fd = new FormData();

            for (var j in userInfo) {
                fd.append(j, userInfo[j]);
            }

            console.log(fd);

            $http.post('/cart/saveFormAjax/', fd, {
                transformRequest: angular.identity,
                headers : { 'Content-Type': undefined }
            })
                .success(function(data) {
                    console.log(data);

                    if (!data.success) {
                        $scope.errorUsername = data.errors.username;
                        $scope.errorPassword = data.errors.password;
                    } else {
                        cart.clearCart();
                        $('.b-cart-table').remove();
                        setTimeout(function(){location.reload()}, 20000);
                        $scope.getPopup($scope.ALEDO_POPUP_ORDER_SUCCESS, {orderId:data['orderId']});
                    }
                });


        };

        $scope.updateFile = function() {
            $scope.setOrderInfo($scope.orderInfo);
        }
    }
    angular.module('aledo.controllers').controller("OrderPlaceController", ["$scope", "$http", "AledoCartService", OrderPlaceController])
        .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                        scope.updateFile();
                    });


                });
            }
        };
    }]);
})(jQuery)