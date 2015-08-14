(function ($) {
    function CommercialsController($scope, $http) {
        $scope.MODE_VIEW_ALL_COMMERCIALS = 0;
        $scope.MODE_VIEW_ONE_COMMERCIAL = 1;
        $scope.MODE_VIEW_ONE_ROOM = 2;

        $scope.commercials = [];
        $scope.rooms = [];
        $scope.products = [];
        $scope.type;
        $scope.viewMode = $scope.MODE_VIEW_ALL_COMMERCIALS;

        $scope.commercial = {
            uid:0,
            datetime:0,
            title:"",
            id:0,
            user_id:0
        };

        $scope.bindData = function(data) {
            $scope.commercials = data;
        };

        $scope.commercialAPI = {
            viewOne: function(commercialId) {
                $http.get("/api/commercials/" + commercialId, {
                    'type': "commercial"
                })
                    .success(function(data){
                        $scope.commercial = angular.fromJson(data);
                        console.log(data, $scope.commercial);
                        $scope.viewMode = $scope.MODE_VIEW_ONE_COMMERCIAL;
                        $scope.$apply();
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
            viewOne: function(commercialId, roomId) {
                $http.get("/api/rooms/" + commercialId + '/' + roomId, {
                    'type': "commercialRoom"
                })
                    .success(function(data){
                        $scope.room = data.room;
                        $scope.viewMode = $scope.MODE_VIEW_ONE_ROOM;
                    })
                    .error(function(err){
                        return err;
                    });

            },

            viewAll: function(commercial) {
                $scope.commercial = commercial;
                $scope.viewMode = $scope.MODE_VIEW_ONE_COMMERCIAL;
            },
            add: function(commercialId) {
                $http.post("/api/rooms/" + commercialId + '/', {
                    'type': "commercialRoom"
                })
                    .success(function(data){
                        $scope.commercial.rooms.push(data.room);
                    })
                    .error(function(err){
                        return err;
                    });

            },
            update: function(commercialId, room) {
                $http.put("/api/rooms/" + commercialId + '/' + room.uid + '/', {
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
            remove: function(commericalId, roomId) {
                $http.delete("/api/rooms/" + commericalId + '/' + roomId + '/', {
                    'type': $scope.type
                })
                    .success(function(){
                        console.log("room successfully deleted")
                    })
                    .error(function(err){
                        return err;
                    });
            }
        }
    }
    angular.module('aledo.controllers')
        .controller("CommercialsController", ["$scope", "$http", CommercialsController]);

})(jQuery)