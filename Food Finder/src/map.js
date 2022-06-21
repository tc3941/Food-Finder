let map;
let geojson = 
    {
        type: 'FeatureCollection',
        features: []
    };
let defaultZoomLevel = 10;

function initMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoidGMzOTQxIiwiYSI6ImNraGY4eThvMTBmeWwydHBmczIyamF5bWEifQ.WfK1OgxTH_5mylizRwACjw';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11'
    });
    map.addControl(new mapboxgl.NavigationControl());
    map.setZoom(15.5);
    map.setCenter([-77.67454147338866,43.083848]); // note the order - it's longitude,latitude - which is opposite of Google Maps
    map.setStyle('mapbox://styles/mapbox/' + "dark-v10");
    
    map.on('dblclick', function(e) {
        // The event object (e) contains information like the
        // coordinates of the point on the map that was clicked.
        e.preventDefault();
        console.log('A click event has occurred at ' + e.lngLat);
        });

    map.on('load', function () {
        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers;
         
        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
        }
        }
         
        map.addLayer(
        {
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
        'fill-extrusion-color': '#aaa',
         
        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
            ],
            'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
            }
            },
            labelLayerId
        );
    });
}
let markers = [];
function addMarkersToMap(){
    
    
    for(let feature of geojson.features){
//geojson.features.forEach(function(marker) {
    addMarker(feature.geometry.coordinates, feature.properties.title, feature.properties.description, 'marker')
    
    /*// create a HTML element for each feature
    let el = document.createElement('div');
    el.className = 'marker';
    
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
    .setLngLat(feature.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
  .setHTML('<h3>' + feature.properties.title + '</h3><p>' + feature.properties.description + '</p>'))
  .addTo(map);*/
};
}

function addMarker(coordinates, title, description, className){
    let el = document.createElement('div');
    el.className = className;

   markers.push( new mapboxgl.Marker(el)
    .setLngLat(coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
  .setHTML('<h3>' + title + '</h3><p>' + description + '</p>'))
  .addTo(map)
   )
}
//https://stackoverflow.com/questions/46155523/mapbox-clear-all-current-markers
function clearMarkers(){
    if (markers!==null) {
        for(let i = markers.length -1;i>=0;i--){
            markers[i].remove();
        }
    }
    markers = [];
    geojson.features = [];
}
let shops = [];
function addShop(lat,long,title,description){
shops.push(
    {
        latitude:lat,
        longitude:long,
        title: title,
        description: description
    }
)
}
function clearShops(){
    shops = [];
}
function loadMarkers(){
    
      
      // now convert this data to GeoJSON
    for(let shop of shops){

        const newFeature = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [shop.longitude,shop.latitude]
            },
            properties: {
                title: shop.title,
                description: shop.description
            }
        };

        //newFeature.geometry.coordinates[0] = shop.longitude;
        //newFeature.geometry.coordinates[1] = shop.latitude;


        geojson.features.push(newFeature);
    }
    console.log(geojson.features);
    //console.log(map);
  }

  
function flyToCity(long,lat){
    flyTo({long,lat});
    map.setZoom(defaultZoomLevel);
    setPitchAndBearing(0,0);
}
function cityZoom(){
    setZoomLevel(defaultZoomLevel);
}

  function flyTo(center = [0,0]){
      map.flyTo({center: center});
  }

  function setZoomLevel(value=0){
      map.setZoom(value);
  }

  function setPitchAndBearing(pitch=0,bearing=0){
      map.setPitch(pitch);
      map.setBearing(bearing);
  }
  
  export { initMap, addMarkersToMap,cityZoom, loadMarkers, flyTo,setZoomLevel, setPitchAndBearing, addMarker, flyToCity,addShop,clearMarkers,clearShops};
