//geolocalizzazione
var options = { 
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: 0
};

var latitude;
var longitude;

function success(posizione) {
    latitude = posizione.coords.latitude;
    longitude = posizione.coords.longitude;
}

function error(err) {
    console.warn('Impossibile accedere alla posizione');
}
  
navigator.geolocation.getCurrentPosition(success, error, options);

export {latitude, longitude};

//mappa
/*mapboxgl.accessToken = 'pk.eyJ1IjoiYWxlMjQweCIsImEiOiJja3IwdTRqem0xdjM3MnpxYTJneHVuNXptIn0.mZ7elTikfESfGCOnYRUMsg';
var map = new mapboxgl.Map({
    container: 'mappa',
    style: 'mapbox://styles/ale240x/ckrbvpq3l0xna18q9nd2ol3l5',
    center: [longitude, latitude],
    //center: [13.355607408018551, 38.11816843527191], // starting position [lng, lat]
    zoom: 13
});

map.on('click', function(e) {

    var features = map.queryRenderedFeatures(e.point, { layers: ['symbols'] });
    if (!features.length) {
        return;
    }
        var feature = features[0];

    var popup = new mapboxgl.Popup({ offset: [0, -15], closeButton: false })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
    '<h5>' + feature.properties.Name + '</h5>' +
    '<p>' + feature.properties.Address + '</p>')
    .addTo(map);
});

map.on('load', function() {
    var geocoder = new MapboxGeocoder({ // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        zoom: 14, // Set the zoom level for geocoding results
        placeholder: "Inserisci un indirizzo", // This placeholder text will display in the search bar
        //bbox: [-105.116, 39.679, -104.898, 39.837], // Set a bounding box
        proximity: { longitude: longitude, latitude: latitude}
    });
// Add the geocoder to the map
map.addControl(geocoder, 'top-left'); // Add the search box to the top left
}); 

var marker = new mapboxgl.Marker({'color': '#008000'});

geocoder.on('result', function(data) {
    var point = data.result.center;
    marker.setLngLat(point).addTo(map);

});*/