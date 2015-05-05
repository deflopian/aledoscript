(function ($) {
    //нужен для передачи данных между OrderPlaceController корзины и OrderPlaceController различных попапов
    var AledoCartService = function() {
        var _prodsInfo = {};
        var _userInfo = {};
        var _orderInfo = {};
        return {
            setProdsInfo: function (prodsInfo) {
                _prodsInfo = prodsInfo;
            },
            getProdsInfo: function () {
                return _prodsInfo;
            },
            setOrderInfo: function (orderInfo) {
                _orderInfo = orderInfo;
            },
            getOrderInfo: function () {
                return _orderInfo;
            },
            setUserInfo: function (userInfo) {
                _userInfo = userInfo;
            },
            getUserInfo: function () {
                return _userInfo;
            }
        }
    };

    angular.module('aledo.services').service('AledoCartService', [AledoCartService]);
})(jQuery)
