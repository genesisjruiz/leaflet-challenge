// Leaflet Challenge
// Fetch Earthquake Data From United States Geological Survey
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(response => response.json())
.then(data => {

    // Create The Map
    var myMap = L.map("map", {
        //center: [38.9072, -77.0369], // Coordinates for Washington, D.C.
        //center: [40.7128, -74.0060], // Coordinates for New York City
        center: [39.8283, -98.5795], // Coordinates for the center of the USA
        zoom: 4
    });
        // Adding The Background of Map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(myMap);
     
    // Plotting Map 
    for (var i = 0; i < data.features.length; i++) {
        var earthquake = data.features[i];
        var magnitude = earthquake.properties.mag;
        var depth = earthquake.geometry.coordinates[2];
        var latlng = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];

        //  Circle Makers and Popup Information
        var circle = L.circleMarker(latlng, {
            radius: magnitude * 5,
            fillColor: getColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(myMap);

        circle.bindPopup("<h3>" + earthquake.properties.place + "</h3><hr><p>" + new Date(earthquake.properties.time) + "</p><hr><p>Magnitude: " + magnitude + "</p><p>Depth: " + depth + " km</p>");
    }

    // Color Function
    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return "#ea2c2c";
            case depth > 70:
                return "#ea822c";
            case depth > 50:
                return "#ee9c00";
            case depth > 30:
                return "#eecc00";
            case depth > 10:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    }

    // Create a legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // Apply styles to the legend
    div.style.backgroundColor = "#fff"; 
    div.style.padding = "4px 6px"; 
    div.style.border = "1px solid #ccc";
    div.style.borderRadius = "4px"; 
    div.style.boxShadow = "none"; 
    div.style.fontSize = "12px";

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '; width:10px; height:10px; display:inline-block; margin-right: 0; #ccc;"></i> ' +
        grades[i] + (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
    legend.addTo(myMap)
});