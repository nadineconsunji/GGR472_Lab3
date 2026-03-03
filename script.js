// Mapbox token to link to my mapbox account and access API requests 
mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaW5lY29uc3VuamkiLCJhIjoiY21rZWU1djI4MDV6NTNkb29meTJzMW81dSJ9.t6RLssyQkfZODRIMy_ToNQ';

/*--------------------------------------------------------------------
Initially loading map in
--------------------------------------------------------------------*/
// Map container will use my map style 
const map = new mapboxgl.Map({
	container: 'my-map', // Map container ID
	style: 'mapbox://styles/nadineconsunji/cmkyjcxru008t01s7c1xvf9fr', // Mapbox style URL
	center: [-79.37, 43.7], // Starting position [lng, lat] to start centred around Toronto 
	zoom: 10.5, // Starting zoom to showcase most of the data upon opening
});

/*--------------------------------------------------------------------
Adding data to the map 
--------------------------------------------------------------------*/
// Once map finishes loading, trigger the following functions 
map.on('load', () => {
    // Resize map accordingly if browser size is changed/minimised 
    map.resize();

// 1. Add data sources 
	// Outdoor bike parking)
    map.addSource('outdoor-bike-parking', { // ID created
        type: 'geojson',
        data: 'Data/OutdoorBicycleParking.geojson' 
    });

	// Bike lanes
    map.addSource('bike-lanes', {
        type: 'geojson',
        data: 'Data/BikeRoutes.geojson'  
    });

    // Bike Share stations per neighbourhood
    map.addSource('bikeshare', {
        type: 'geojson',
        data: 'Data/bikeshare.geojson'
    });

// 2. Visualise data layers/load them into the map 
    // Bike share station data illustrated through polygons, coloured based on abundance of stations per neighbourhood
    map.addLayer({
        'id': 'bikeshare-fill',
        'type': 'fill',
        'source': 'bikeshare',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['to-number', ['get', 'bike_share']], // GET expression retrieves property value from 'bike_share' data field
                '#fd8d3c', // Colour assigned to any values < first step
                15, '#fc4e2a', // Colours assigned to values >= each step
                30, '#e31a1c',
                45, '#bd0026',
                60, '#800026'
            ],
            'fill-opacity': 0.7,  
            'fill-outline-color': 'white'
        }
    });

    // Outdoor bike parking illustrated through points 
    map.addLayer({
        'id': 'outdoor-bike-parking-ppt', // ID created
        'type': 'circle', // Point format
        'source': 'outdoor-bike-parking', // Link to name of the source
        // Formatting 
        'paint': {
            'circle-radius': ['interpolate',
                ['linear'],
                ['zoom'],
                10, 1,
                17, 25],
            'circle-color': '#000000'
        }
    });

	// Bike lanes illustrated through lines 
    map.addLayer({
        id: 'bike-lanes-line', // ID created
        type: 'line', // Line format
        source: 'bike-lanes', // Link to name of the source 
        // Formatting
        paint: {
            'line-width': 2, 
            'line-color': '#276221'
        }
    },
        'outdoor-bike-parking-ppt' // Ensures points are layered above lines 
    );

});

/*--------------------------------------------------------------------
Adding map controls 
--------------------------------------------------------------------*/
// Search control 
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: "ca" // Limit to Canada only
    })
);

// Add zoom and rotation controls to the top left of the map
map.addControl(new mapboxgl.NavigationControl());

// Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

/*--------------------------------------------------------------------
Adding interactivity 
--------------------------------------------------------------------*/

// 1) Add event listener which returns map view to original view on button click using flyTo method
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.37, 43.7],
        zoom: 10.5,
        essential: true
    });
});


// 2) Change display of legend based on check box
const legendcheck = document.getElementById('legendcheck');
const bikeshareLegend = document.getElementById('bikeshare-legend');
const routesLegend = document.getElementById('routes-parking-legend');

bikeshareLegend.style.display = legendcheck.checked ? 'block' : 'none';
routesLegend.style.display = legendcheck.checked ? 'block' : 'none';

legendcheck.addEventListener('change', () => {
    if (legendcheck.checked) {
        bikeshareLegend.style.display = 'block';
        routesLegend.style.display = 'block';
    } else {
        bikeshareLegend.style.display = 'none';
        routesLegend.style.display = 'none';
    }
});

// 3) Change display of bike share stations layer based on check box using setLayoutProperty method
document.getElementById('layercheck').addEventListener('change', (e) => {
    map.setLayoutProperty(
        'bikeshare-fill',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});

// 4) Filter data layer to show selected neighbourhood near UofT from dropdown selection
let boundaryvalue;

document.getElementById("boundaryfieldset").addEventListener('change',(e) => {   
    boundaryvalue = document.getElementById('boundary').value;

    if (boundaryvalue == 'All') {
        map.setFilter(
            'bikeshare-fill',
            ['has', 'AREA_NAME'] // Returns all polygons from layer that have a value in AREA_NAME field
        );
    } else {
        map.setFilter(
            'bikeshare-fill',
            ['==', ['get', 'AREA_NAME'], boundaryvalue] // returns polygon with AREA_NAME value that matches dropdown selection
        );
    }

});

/*--------------------------------------------------------------------
Adding click events (when neighbourhood is clicked, a pop-up will display its name)
--------------------------------------------------------------------*/
map.on('load', () => {
    // Changing mouse to pointer when over bike share layer
    map.on('mouseenter', 'bikeshare-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Changing mouse to normal cursor when no longer over bike share layer
    map.on('mouseleave', 'bikeshare-fill', () => {
        map.getCanvas().style.cursor = '';
    });

    // Coding for pop-up when mouse clicks a neighbourhood
    map.on('click', 'bikeshare-fill', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("Neighbourhood: " + e.features[0].properties.AREA_NAME)
            .addTo(map);
    });

});
