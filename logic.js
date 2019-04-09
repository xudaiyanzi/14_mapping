// Create our map, giving it the streetmap and earthquakes layers to display on load
// Creating map object
var myMap = L.map("map", {
center: [35, -97],
zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);


// Store our API endpoint inside queryUrl (M2.5+ Earthquakes in past 30days)
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

var geojson;

// set the color gradient
function getColor(d) {
  return d > 5 ? '#800026' :
         d > 4  ? '#BD0026' :
         d > 3  ? '#E31A1C' :
         d > 2  ? '#FC4E2A' :
         d > 1   ? '#FD8D3C' :
         d > 0   ? '#FEB24C' :
         '#FFEDA0';
};

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(s) {
  return s/20;
};

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  //Creating a geoJSON layer with the retrieved data
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          
          //expressed in pixels
          radius:markerSize(feature.properties.sig),

          fillColor: getColor(feature.properties.sig/100),

          //black outline
          color: "#000", 

          //outline width
          weight: 1, 

          //line opacity
          opacity: 1, 

          //fillcolor opacity
          fillOpacity: 0.8
        });
    },
    
    // Called on each feature
    onEachFeature: function(feature, layer) {

      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");

      }
  }).addTo(myMap);

  
  //set the legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i]) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);


});
