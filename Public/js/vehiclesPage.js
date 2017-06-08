function editVehicle(rowId, _id) {
    rowId--;
    var $row = $("#vehiclesTable tbody")[0].rows[rowId];

    $('#editVehicleManufacturer :input').attr('value', $row.cells[0].innerHTML);
    $('#editVehicleModel :input').attr('value', $row.cells[1].innerHTML);
    $('#editVehicleRegistrationPlate :input').attr('value', $row.cells[2].innerHTML);
    $('#editVehicleVin :input').attr('value', $row.cells[3].innerHTML);
    $('#editVehicleEngineCapacity :input').attr('value', $row.cells[4].innerHTML);
    $('#editVehiclFuelType :input').attr('value', $row.cells[5].innerHTML);
    $('#editVehicleHorsepower :input').attr('value', $row.cells[6].innerHTML);
    $('#editVehicleFuelConsumption :input').attr('value', $row.cells[7].innerHTML);
    $('#editVehicleKilometrage :input').attr('value', $row.cells[8].innerHTML);

    $('#editVehicleForm').attr('action', "/vehicles/update/" + _id);
}

function deleteVehicle(rowId, _id) {
    rowId--;
    var $row = $("#vehiclesTable tbody")[0].rows[rowId];

    $('#deleteVehicleRegistrationPlate').text($row.cells[0].innerHTML + " " + $row.cells[1].innerHTML);

    $('#deleteVehicleHref').attr('href', "/vehicles/delete/" + _id);
}

/*
function addTripsToTable(trip, index) {
    // date/time format: yyyy-MM-dd HH:mm:ss
    var startDate = trip.startDate;
    var stopDate = trip.stopDate;
    startDate = startDate.slice(0, 10) + ' ' + startDate.slice(11, 19);
    stopDate = stopDate.slice(0, 10) + ' ' + stopDate.slice(11, 19);

    var tripSpan = $('<span>').addClass('glyphicon glyphicon-road');
    var tripButton = $('<button>').addClass('btn btn-success btn-md').attr('data-toggle', 'modal').attr('data-title', 'View trip').append(tripSpan).on('click', function () {
        initMap(trip.tripId);
    });
    var viewTripButton = $('<p>').addClass('operations').attr('data-placement', 'top').attr('data-toggle', 'tooltip').attr('title', 'View trip').append(tripButton);

    $('#tripsTable').find('tbody').append($('<tr>').append($('<td>').attr('data-label', 'Driver').text(trip.driver.firstName + ' ' + trip.driver.lastName)));
    $('#tripsTable tr:last').append($('<td>').attr('data-label', 'Start date').text(startDate));
    $('#tripsTable tr:last').append($('<td>').attr('data-label', 'Start location').text(trip.startLocation.lat + ', ' + trip.startLocation.long));
    $('#tripsTable tr:last').append($('<td>').attr('data-label', 'Stop date').text(stopDate));
    $('#tripsTable tr:last').append($('<td>').attr('data-label', 'Stop location').text(trip.stopLocation.lat + ', ' + trip.stopLocation.long));
    $('#tripsTable tr:last').append($('<td>').attr('data-label', 'Trip distance').text(trip.distance));
    $('#tripsTable tr:last').append($('<td>').attr('data-label', 'Trips').append(viewTripButton));

    getAddress(trip.startLocation.lat, trip.startLocation.long, index, 2);
    getAddress(trip.stopLocation.lat, trip.stopLocation.long, index, 4);
}*/

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

// Transform lat/long into address
function getAddress(myLatitude, myLongitude, row, col) {
    var geocoder = new google.maps.Geocoder(); // create a geocoder object
    var location = new google.maps.LatLng(myLatitude, myLongitude); // turn coordinates into an object

    // Avoid more than 5 requests in a second, otherwise Geocode failure: OVER_QUERY_LIMIT
    setTimeout(function () {
        geocoder.geocode({
            'latLng': location
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) { // if geocode success
                var table = document.getElementById("tripsTable");
                table.rows[row + 1].cells[col].innerHTML = results[0].formatted_address;
            } else {
                sleep(1000);
                geocoder.geocode({
                    'latLng': location
                }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) { // if geocode success
                        var table = document.getElementById("tripsTable");
                        table.rows[row + 1].cells[col].innerHTML = results[0].formatted_address;
                    } else {
                        sleep(1000);
                        geocoder.geocode({
                            'latLng': location
                        }, function (results, status) {
                            if (status === google.maps.GeocoderStatus.OK) { // if geocode success
                                var table = document.getElementById("tripsTable");
                                table.rows[row + 1].cells[col].innerHTML = results[0].formatted_address;
                            }
                        });
                    }
                });
            }
        })
    }, 1000);
}

function initMap(tripID) {
    //var route1Latlng = new google.maps.LatLng(44.4460, 26.0531);
    var mapOptions = {
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);

    $.ajax({
        type: "GET",
        url: tripID + ".gpx",
        dataType: "xml",
        success: function (xml) {
            var points = [];
            var bounds = new google.maps.LatLngBounds();
            $(xml).find("trkpt").each(function () {
                var lat = $(this).attr("lat");
                var lon = $(this).attr("lon");
                var p = new google.maps.LatLng(lat, lon);
                points.push(p);
                bounds.extend(p);
            });
            var poly = new google.maps.Polyline({
                // use your own style here
                path: points,
                strokeColor: "#FF0000",
                strokeOpacity: .7,
                strokeWeight: 4
            });
            poly.setMap(map);
            // fit bounds to track
            map.fitBounds(bounds);
        }
    });

    $('#viewTripModal').on('shown.bs.modal', function () {
        google.maps.event.trigger(map, 'resize');
    });
    $('#viewTripModal').modal("show");
}
