(function ($) {
    function CommercialsController($scope, $http, CookieFactory) {
        $scope.MODE_VIEW_ALL_COMMERCIALS = 0;
        $scope.MODE_VIEW_ONE_COMMERCIAL = 1;
        $scope.MODE_VIEW_ONE_ROOM = 2;
        $scope.viewRoomId = 0;
        $scope.viewCommercialUid = 0;
        $scope.commercials = [];
        $scope.rooms = [];
        $scope.products = [];
        $scope.type;
        $scope.viewMode = $scope.MODE_VIEW_ALL_COMMERCIALS;

        $scope.sortableOptions = {

        };



        $scope.getDate = function(phptime) {
            var date = new Date(phptime*1000);
            var day = date.getDate().toString();
            if (day.length == 1) {
                day = "0".concat(day);
            }
            var month = (date.getMonth()+1).toString();
            if (month.length == 1) {
                month = "0".concat(month);
            }
            return day + "." + month + "." + date.getFullYear();
        };

        $scope.commercial = {
            uid:0,
            datetime:0,
            title:"",
            id:0,
            user_id:0
        };

        $scope.bindData = function(data) {
            $scope.commercials = data;
            $scope.urledParams();
        };

        $scope.updateUrl = function() {
            $.param({});
            console.log($scope.viewCommercialUid, $scope.viewRoomId);
            var params = {};


            if ($scope.viewCommercialUid) {
                params.c = $scope.viewCommercialUid;
            }
            if ($scope.viewRoomId) {
                params.r = $scope.viewRoomId;
            }
            var qString = $.param(params);
            if (qString) {
                qString = '?' + qString + "#offers_1";
            }
            history.pushState(null, null, qString);

        };

        $scope.urledParams = function() {
            console.log(location.hash);
            if (location.hash == "#offers_1") {
                var params = $.url();
                var commercialId = params.param('c');
                var roomId = params.param('r');

                if (commercialId) {

                    if (roomId) {
                        $scope.commercialAPI.viewOne(commercialId, $scope.roomAPI.viewOne, roomId);
                    } else {
                        $scope.commercialAPI.viewOne(commercialId);
                    }
                } else {

                }
            }

        };

        $scope.checkProdInRoom = function(prodId) {
            console.log($scope.prodsInRoom);
            for (var k in $scope.prodsInRoom) {
                if ($scope.prodsInRoom[k] == prodId) {
                    return true;
                }
            }
            return false;
        };
        $scope.initProdInRoom = function() {
            CookieFactory.getCookie('prodscommercial').then(function(result) {
                $scope.prodsInRoom = result;
                console.log($scope.prodsInRoom);
            });

        };

        $scope.setCommercialMode = function(commercialId, roomId, room) {
            var prodIds = [];

            for(var k in room.prods) {
                prodIds.push(room.prods[k].product_id);
            }
            CookieFactory.setCookie('prodscommercial', prodIds);
            CookieFactory.setCookie('commercial', [commercialId, roomId]);

            location.href="/catalog/";


        };
        $scope.closeCommercialMode = function() {
            console.log('trying to remove cookie...');
            //CookieFactory.deleteCookie('commercial');
            CookieFactory.setCookie('commercial', '');
        };

        $scope.commercialAPI = {
            viewOne: function(commercialId, then, arg) {
                $http.get("/api/commercials/" + commercialId, {
                    'type': "commercial"
                })
                    .success(function(data){
                        $scope.commercial = angular.fromJson(data);
                        $scope.viewMode = $scope.MODE_VIEW_ONE_COMMERCIAL;
                        $scope.viewCommercialUid = $scope.commercial.uid;
                        if (then) {
                            if (arg) {
                                then(arg);
                            } else {
                                then();
                            }

                        }
                        $scope.updateUrl();
                    })
                    .error(function(err){
                        return err;
                    });

            },

            viewAll: function() {
                $scope.viewMode = $scope.MODE_VIEW_ALL_COMMERCIALS;
            },
            add: function() {
                $http.post("/api/commercials/", {
                    'type': "commercial"
                })
                    .success(function(commercial){
                        $scope.commercials.push(commercial);
                    })
                    .error(function(err){
                        return err;
                    });

            },
            update: function(commercial) {
                commercial.title = $('.b-editable-field__inner.commercial' + commercial.uid).find('span').text();
                $http.put("/api/commercials/" + commercial.uid, {
                    'type': "commercial",
                    'entity' : commercial
                })
                    .success(function(commercial){
                        console.log("commercial successfully updated")
                    })
                    .error(function(err){
                        return err;
                    });
            },
            remove: function(commericalId) {
                $http.delete("/api/commercials/" + commericalId, {
                    'type': "commercial"
                })
                    .success(function(commercial){
                        console.log("commercial successfully deleted")
                    })
                    .error(function(err){
                        return err;
                    });
            }
        };

        $scope.roomAPI = {
            makesort: function($item, $partFrom, $partTo, $indexFrom, $indexTo) {
                var arr = {}, i = [];
                for (i=0; i < $scope.commercial.rooms.length; i++) {
                    arr[$scope.commercial.rooms[i].id.toString()] = i;
                }
                console.log(arr);
                $http.post("/commercials/changeRoomOrder/", {
                    'comm_uid': $scope.commercial.uid,
                    'order' : arr
                })
                    .success(function(data){
                        console.log(data);
                    })
                    .error(function(err){
                        return err;
                    });
            },

            viewOne: function(roomId) {
                if ($scope.viewMode == $scope.MODE_VIEW_ONE_ROOM && $scope.viewRoomId == roomId) {
                    $scope.viewMode = $scope.MODE_VIEW_ONE_COMMERCIAL;
                    $scope.viewRoomId = 0;
                } else {
                    $http.get("/api/rooms/" + roomId, {
                        'type': "commercialRoom"
                    })
                        .success(function(data){
                            $scope.room = data;
                            $scope.viewMode = $scope.MODE_VIEW_ONE_ROOM;
                            $scope.viewRoomId = $scope.room.id;
                            $scope.updateUrl();

                        })
                        .error(function(err){
                            return err;
                        });
                }


            },

            viewAll: function(commercial) {
                $scope.commercial = commercial;
                $scope.viewMode = $scope.MODE_VIEW_ONE_COMMERCIAL;
                $scope.updateUrl();
            },
            add: function(commercialId) {
                $http.post("/api/rooms/" + commercialId + '/', {
                    'type': "commercialRoom",
                    'commId' : commercialId
                })
                    .success(function(data){
                        $scope.commercial.rooms.push(data);
                    })
                    .error(function(err){
                        return err;
                    });

            },
            update: function(room) {
                room.title = $('.b-editable-field__inner.room' + room.id).find('span').text();
                $http.put("/api/rooms/" + room.id + '/', {
                    'type': "commercialRoom",
                    'entity' : room
                })
                    .success(function(){
                        console.log("room successfully updated")
                    })
                    .error(function(err){
                        return err;
                    });
            },
            remove: function(roomId) {
                $http.delete("/api/rooms/" + roomId + '/', {
                    'type': $scope.type
                })
                    .success(function(){
                        console.log("room successfully deleted")
                    })
                    .error(function(err){
                        return err;
                    });
            }
        };
        $scope.prodAPI = {

            add: function( prodId) {
                CookieFactory.getCookie('commercial').then(function(result) {
                    if (result[1]) {
                        var roomId = result[1];
                        $http.post("/api/comprod/", {
                            'type': "commercialProd",
                            'roomId' : roomId,
                            'prodId' : prodId
                        })
                            .success(function(data){

                                CookieFactory.getCookie('prodscommercial').then(function(result) {
                                    result.push(data.product_id);
                                    $scope.prodsInRoom.push(data.product_id);
                                    CookieFactory.setCookie('prodscommercial', result);
                                });

                                console.log(data);
                            })
                            .error(function(err){
                                return err;
                            });
                    }
                });
            },
            upCount: function(comprod, room) {
                comprod.count++;
                $scope.prodAPI.update(comprod);
                room.summ = parseFloat(room.summ) + parseFloat(comprod.old_price);
            },
            downCount: function(comprod, room) {
                comprod.count = Math.max(0, comprod.count-1);
                $scope.prodAPI.update(comprod);
                room.summ = Math.max(0, parseFloat(room.summ) - parseFloat(comprod.old_price));

            },
            remove: function(roomId, comprodId, room) {
                $http.delete("/api/comprod/" + comprodId + '/', {
                    'type': "commercialProd",
                    'roomId' : roomId
                })
                    .success(function(){
                        console.log("commercial product successfully deleted");
                        for(var pkey in room.prods) {
                            if (room.prods[pkey].id == comprodId) {
                                room.prods.splice(pkey, 1);
                                break;
                            }
                        }
                    })
                    .error(function(err){
                        return err;
                    });
            },
            update: function(comprod) {
                $http.put("/api/comprod/" + comprod.id + '/', {
                    'type': "commercialProd",
                    'entity' : comprod
                })
                    .success(function(data){

                        console.log(data.old_price);


                        console.log("commercial product successfully updated");
                    })
                    .error(function(err){
                        return err;
                    });
            }
        }
    }
    angular.module('aledo.controllers')
        .controller("CommercialsController", ["$scope", "$http", 'CookieFactory', CommercialsController]);

})(jQuery)