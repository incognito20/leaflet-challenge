// Set url to variable
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Query and set response
d3.json(url).then(function(data) {
    createFeatures(data.features);
  });


// Sets the color of marker based on depth. Deeper = darker.
function markerColor(depth) {
    if (depth >= 150) {
        return "#660066";
    } else if (depth < 150 && depth >= 120) {
        return "#cc00cc";
    } else if (depth < 120 && depth > 90) {
        return "#ff00ff";
    } else if (depth < 90 && depth > 60) {
        return "#ff66ff";
    } else if (depth < 60 && depth > 30) {
        return "#ff99ff";
    } else {
        return "#ffccff";
    }
};

// Sets the size of the marker based on the value of the magnitude. Multiplied by 3 for better visualization.
function markerSize(magnitude) {
    return magnitude * 3;
    }
    
// Runs for each item.
function createFeatures(earthquakeData) {
// When the marker is clicked on this provides location description, depth, and magnitude.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><h3>Depth: ${feature.geometry.coordinates[2]}</h3><h3>Magnitude: ${feature.properties.mag}</h3>`)
    } 
  
// Sets the circle marker for each object in the array, sets radius from markerSize, and color from markerColor.
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#660066",
                weight: 1,
                opacity: .75,
                fillOpacity: 0.5
            });
        },
        onEachFeature: onEachFeature
      });
  
      // Creates earthquakes layer
    createMap(earthquakes);
  }

  function createMap(earthquakes) {

    // Sets streetmap
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    
    });
  
  
    // Sets the baseMaps object
    let baseMaps = {
      "Street": street
    };
  
    // Sets the overlay object
    let overlayMaps = {
      "Earthquakes": earthquakes
    };
    
    // Creates map with the provided center and with a wide view. Both layers are used.
    let myMap = L.map("map", {
      center: [
        35.01528515699986, -97.51070301108402
      ],
      zoom: 3,
      layers: [street, earthquakes]
    });
  
// Creates the map legend
let legend = L.control({position: "bottomright"});

// Depth values represent a value from each of the six possible data ranges so the loop captures each possible color value.
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    var depth = [1, 35, 75, 100, 130, 151];
    var labels = ["Less than 30", "30 to 60", "60 to 90", "90 to 120", "120 to 150", "Greater than 150"];
    div.innerHTML = '<div>Depth of the event in kilometers</div>';
    for (var i = 0; i < depth.length; i++){
      div.innerHTML += '<i style="background:' + markerColor(depth[i]) + '">&nbsp;&nbsp;&nbsp;&nbsp;</i>&nbsp;'+
                      labels[i] + '<br>';
    }
    return div;
};
  
  
// Adds legend to map
legend.addTo(myMap);
};
