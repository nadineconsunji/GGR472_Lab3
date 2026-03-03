// Mapbox token to link to my mapbox account and access API requests 
mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaW5lY29uc3VuamkiLCJhIjoiY21rZWU1djI4MDV6NTNkb29meTJzMW81dSJ9.t6RLssyQkfZODRIMy_ToNQ';

// Map container will use my map style 
const map = new mapboxgl.Map({
	container: 'my-map', // Map container ID
	style: 'mapbox://styles/nadineconsunji/cmkyjcxru008t01s7c1xvf9fr', // Mapbox style URL
	center: [-79.40, 43.66], // Starting position [lng, lat] to start centred around Toronto 
	zoom: 11, // Starting zoom to showcase most of the data upon opening
});

// Once map finishes loading, trigger the following functions 
map.on('load', () => {
    // Resize map accordingly if browser size is changed/minimised 
    map.resize();

// 1. Add data sources 
	// Outdoor bike parking - GeoJSON file (added via URL for organisation)
    map.addSource('outdoor-bike-parking', { // ID created
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/nadineconsunji/GGR472_Lab2/main/Data/OutdoorBicycleParking.geojson' 
    });

	// Bike lanes - GeoJSON file (added via URL for organisation)
    map.addSource('bike-lanes', { // ID created
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/nadineconsunji/GGR472_Lab2/main/Data/BikeRoutes.geojson'  
    });

    map.addSource('provterr-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/nadineconsunji/GGR472_Lab3/main/Data/trial.geojson'
    });

// 2. Visualise data layers/load them into the map 
	// Outdoor bike parking illustrated through points 
    map.addLayer({
        'id': 'outdoor-bike-parking-ppt', // ID created
        'type': 'circle', // Point format
        'source': 'outdoor-bike-parking', // Link to name of the source
        // Formatting 
        'paint': {
            'circle-radius': 6,
            'circle-color': '#c90000'
        }
    });

    map.addLayer({
        'id': 'provterr-fill',
        'type': 'fill',
        'source': 'provterr-data',
        'paint': {
            'fill-color': '#c90000'
        }
    });

	// // Bike lanes illustrated through lines 
    // map.addLayer({
    //     id: 'bike-lanes-line', // ID created
    //     type: 'line', // Line format
    //     source: 'bike-lanes', // Link to name of the source 
    // },
    //     'outdoor-bike-parking-ppt' // Ensures points are layered above lines 
    // );

});