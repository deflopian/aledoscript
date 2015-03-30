function ContactsMap() {
    var directionsDisplay;
    var directionsService = null;
    var map;
    var aledo = 0;
    var from = 0;
    var infowindow = null;
    var options = {
        $map: jQuery(".b-routing-map"),
        $stepsContainer: jQuery(".b-route-steps-wrapper"),
        $previewContainer : jQuery(".b-route-preview"),
        $routeFrom: jQuery("#routeFrom"),
        $routeInclude: jQuery("#routeInclude"),
        $driverType: jQuery("input[name=driverType]")
};
    function initialize() {
        directionsService = new google.maps.DirectionsService();
        aledo = new google.maps.LatLng(59.909482, 30.3069597);
        from = new google.maps.LatLng(59.9081801, 30.2989646);

        directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });

        var mapOptions = {
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: aledo,
            scrollwheel: true,
            marker: true

        };
        map = new google.maps.Map(options.$map[0], mapOptions);
        infowindow = new google.maps.InfoWindow({
            content: '<div style="height: 30px; min-height: 30px; width: 150px; min-width: 150px;"><img style="width: 150px; padding: 2px; height: 29px" src="http://aledo-pro.ru/images/aledo-logo-without-title.png" /></div>',
            position: aledo
        });

        directionsDisplay.setMap(map);
        var marker = new google.maps.Marker({
            position: aledo,
            clickable: true,
            map: map,
            icon: new google.maps.MarkerImage(
                "/Content/images/aledo-map-marker.png",
                new google.maps.Size(28, 46),
                new google.maps.Point(0, 0),
                new google.maps.Point(13, 46)
            ),

            title: "ALEDO Светодиодные системы"
        });
        infowindow.open(map, marker);
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
        });

    }

    function getTravelMode(val) {
        var res = google.maps.TravelMode.DRIVING;
        if (val === '1') {
            res = google.maps.TravelMode.DRIVING;
        } else if (val === '2') {
            res = google.maps.TravelMode.WALKING;
        } else if (val === '3') {
            res = google.maps.TravelMode.TRANSIT;
        }

        return res;
    }

    function calcRoute() {
        var travelMode = getTravelMode(options.$driverType.filter(":checked").val());
        
        var waypoints = [];
        var wp = options.$routeInclude.val();
        if (wp) {
            var waypoint = {
                location: wp,
                stopover: false
            };
            waypoints.push(waypoint);
        }
        var request = {
            origin: options.$routeFrom.val(),
            waypoints: waypoints,
            region: 'RU-SPE',
            destination: aledo,
            // Note that Javascript allows us to access the constant
            // using square brackets and a string value as its
            // "property."
            travelMode: travelMode
        };

        // Start/Finish icons
        var icons = {
            start: new google.maps.MarkerImage(
                // URL
                '/Content/images/aledo-map-marker-info.png',
                // (width,height)
                new google.maps.Size(28, 46),
                // The origin point (x,y)
                new google.maps.Point(0, 0),
                // The anchor point (x,y)
                new google.maps.Point(14, 46)
            )
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                //console.log(response);
                directionsDisplay.setDirections(response);

                var leg = response.routes[0].legs[0];
                makeMarker(leg.start_location, icons.start, options.$routeFrom.val());
                options.$previewContainer.hide();
                options.$stepsContainer.show().html(drawDirections(response));

            }
        });


    }

    function makeMarker(position, icon, title) {
        var m = new google.maps.Marker({
            position: position,
            map: map,
            icon: icon,
            clickable: true,
            title: title
        });
        infowindow2 = new google.maps.InfoWindow({
            content: title,
            position: position
        });
        google.maps.event.addListener(m, 'click', function () {
            infowindow2.open(map, m);
        });

    }

    function drawDirections(response) {


        var warning = '<div class="alert-warning">Что-то пошло не так, проверьте правильность пункта назначения</div>';


        var routes = response.routes;
        if (!routes || routes.length == 0) {
            return warning;
        }
        var route = routes[0];
        var legs = route.legs;
        if (!legs || legs.length == 0) {
            return warning;
        }
        var leg = legs[0];
        var steps = leg.steps;
        if (!steps || steps.length == 0) {
            return warning;
        }
        var html =
            '<table cellpadding="0" cellspacing="0" border="0" class="b-route-address">' +
                '<tr><td class="b-route-address__icon-cell"><div class="b-route-address__image-w">' +
                '<img style="width: auto" src="/Content/images/aledo-map-marker-info.png" /></td>' +
               
                '<td class="b-route-address__address-cell"><h4 class="b-route-address__heading text-uppercase">' + options.$routeFrom.val() + '</h4>' +
                '<h4 class="b-route-address__heading text-yellow text-uppercase">' +
                leg.distance.text + ' — ' + leg.duration.text +
                '</h4></td></tr>' +
                '</table><hr class="dotted-separator b-mb1"/>' +
                '</div><table class="b-route-steps" cellpadding="0" border="0" cellspacing="0">';
        for (var i = 0; i < steps.length; i++) {
            var gstep = steps[i];

            step.id = i + 1;
            step.distance = gstep.distance.text;
            step.duration = gstep.duration.text;
            step.instructions = gstep.instructions;
            step.maneuver = gstep.maneuver;


            html += '<tr>'+ step.html() + '</tr>';
        }
        return html += '</table><table cellpadding="0" cellspacing="0" border="0" class="b-route-address b-route-address_destination">' +
            '<tr><td class="b-route-address__icon-cell"><div class="b-route-address__image-w">' +
            '<img style="width: auto" src="/Content/images/aledo-map-marker.png" /></td>' +
            '<td class="b-route-address__address-cell"><h4 class="b-route-address__heading text-uppercase"> СПб, Измайловский пр., 31,<br/> ALEDO Светодиодные системы </h4>' +
            '</tr>' +
            '</table><hr class="dotted-separator"/>'+
            '<div class="b-mt1 text-right"><small>' + route.copyrights + '</small></div>';

    }
    var step = {
        closeTag: '</td>',
        id: 0,
        instructions: "",
        distance: "",
        duration: 0,
        maneuver: "",
        travel_mode: "",

        html: function() {
            var h = '<td class="b-route-step-cell b-route-step-cell_route-maneuver">';
         
            if (this.maneuver) {
                h += '<div class="aledo-route-maneuver aledo-route-maneuver_' + this.maneuver + '">' +
                    '<img width="19" height="630" src="/Content/images/aledo-route-maneurs.svg" />' +
                    '</div>';
            } else {
                h += '<div class="aledo-route-maneuver"></div>';
            }

            h += this.closeTag + '<td class="b-route-step-cell b-route-step-cell_route-id">';
            h +=
                 this.id + '.' + this.closeTag +
               '<td class="b-route-step-cell b-route-step-cell_route-instructions">' + this.instructions + this.closeTag +
               '<td class="b-route-step-cell b-route-step-cell_route-distance">' + this.distance + this.closeTag;
             
            return h;
        }
    };
    return {
        init: initialize,
        calcRoute: calcRoute
    }
}