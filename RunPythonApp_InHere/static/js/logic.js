// Data source variables
// var countryRank = 'https://earthquake.usgs.gov/ranks/feed/v1.0/summary/all_week.geojson';
// var tectonicInfo = 'static/js/PB2002_boundaries.json'
// var orogensInfo = 'static/js/PB2002_orogens.json'
// var stepsInfo = 'static/js/PB2002_steps.json'
// var countryRank = 'static/test_rank.csv'
var europeMap = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json' //https://github.com/johan/world.geo.json/blob/master/countries.geo.json
console.log(countryRank)

// Perform a GET request to the query URL
d3.csv(countryRank, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data)
    createFeatures(data.rank);
});

function createFeatures(countryRank) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    var ranks = L.geoJSON(countryRank, {
        onEachFeature(feature, layer) {
            layer.bindPopup(`<h3> Magnitued: ${feature.rank}<h3> \
            <h3> Location: ${feature.properties.place}<h3> \
            <h3> Date: ${new Date(feature.properties.time)}<h3>`);
        },
        pointToLayer(feature, latlng) {
            return new L.circleMarker(latlng, {
                fillOpacity: .85,
                radius: setRadius(feature.rank),
                fillColor: getColor(feature.rank),
                stroke: false
            })
        }
    });
    createMap(ranks);
}

// function createMap(ranks) {
//     // Define streetmap and darkmap layers
//     var satellite = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token=${API_KEY}`, {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "mapbox.satellite",
//     });

//     var greyscale = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=${API_KEY}`, {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "mapbox.light",
//     });

//     var outdoors = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token=${API_KEY}`, {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "mapbox.outdoors",
//     });

//     // Define a baseMaps object to hold our base layers
//     var baseMaps = {
//         "Satellite": satellite,
//         "Grayscale": greyscale,
//         'Outdoors': outdoors
//     };

//     // Create overlay object to hold our overlay layer
//     var overlayMaps = {
//         'Ranks': ranks
//     };

//     // Create our map, giving it the streetmap and ranks layers to display on load
//     var myMap = L.map("map", {
//         worldCopyJump: true,
//         center: [37.09, -95.71],
//         zoom: 5,
//         layers: [satellite, ranks]
//     });
// }



// Create a layer control
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Set up the legend - from https://leafletjs.com/examples/choropleth/
var legend = L.control({
    position: "bottomright"
});

var legend = L.control({
    position: "bottomright"
});
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        colors = [15000, 20000, 50000, 100000, 200000, 500000, 1000000],
        labels = [];

    div.innerHTML += '<h4>GDP in Thousands of Millions of USD</h4>';

    // Loops through GDP data and grabs colors for each range and puts them in the legend’s key
    for (var i = 0; i < colors.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(colors[i] + 1) + '"></i>' +
            colors[i] + (colors[i + 1] ? '&ndash;' + colors[i + 1] + '<br>' : '+');
    }

    return div;
};
// Adding legend to the map
legend.addTo(myMap);

// On hover control that displays information about hovered upon country
var displayInfo = L.control();

displayInfo.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// Passes properties of hovered upon country and displays it in the control
displayInfo.update = function (props) {

    this._div.innerHTML = '<h2>Wealth of European Countries</h2>' + (props ?
        '<h3>' + props.formal_en + '</h3>' + '<b>' + 'GDP in Trillions of USD: ' + '</b>' + props.gdp_md_est / 1000000 + '<br />' +
        '<b>' + ' GDP in Billions of USD: ' + '</b>' + props.gdp_md_est / 1000 + '<br />' +
        '<b>' + 'Economic Status: ' + '</b>' + props.economy + '<br />' +
        '<b>' + 'Population: ' + '</b>' + props.pop_est / 1000000 + ' million people' :
        'Hover over a European country');
};

displayInfo.addTo(mymap);

// Happens on mouse hover
function highlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#ffd32a'
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    // Updates custom legend on hover
    displayInfo.update(layer.feature.properties);
}

// Happens on mouse out
function reset(e) {
    geojson.resetStyle(e.target);
    // Resets custom legend when user unhovers
    displayInfo.update();
}


// Color function - from https://leafletjs.com/examples/choropleth/
function getColor(d) {
    return d > 150 ? '#800026' :
        d > 110 ? '#FF5733' :
        d > 70 ? '#FF5715' :
        d > 30 ? '#FFC300' :
        d > 10 ? '#7DFF33' :
        '#DAF7A6';
}

function highlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#ffd32a',
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    displayInfo.update(layer.feature.properties);
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.gdp_md_est),
        weight: 1,
        opacity: 1,
        color: 'snow',
        fillOpacity: .7
    };
}

function zoomToCountry(e) {
    mymap.fitBounds(e.target.getBounds());
};

function reset(e) {
    geojson.resetStyle(e.target);
    displayInfo.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlight,
        mouseout: reset,
        click: zoomToCountry
    });
}