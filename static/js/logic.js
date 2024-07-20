//setting a var for the earthquake geo data
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// creating colors for depth of shocks based on data on a green->red shallow to deep range
function getColor(depth) {
    if (depth <= 10) return "#6BFF33";
    else if (depth <= 30) return "#D1FF33";
    else if (depth <= 50) return "#FFD433";
    else if (depth <= 70) return "#FFA533";
    else if (depth <= 90) return "#FF7733";
    else return "#FF4233";
}

//d3 making a request to get data from the usgs
d3.json(queryUrl).then((data) => {
    createFeatures(data.features);
});

//function to display the earthquake data
function createFeatures(quakeData) {
    
    //this makes the pop-up window that displays earthquake info
    function quakePop(feature,layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    //this function resizes the quake markers based on magnitude
    function magnitude(feature, latlng){
        let markers = {
            color: "black",
            fillColor: getColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.75,
            radius: feature.properties.mag*5,
            weight: 1
        }
        return L.circleMarker(latlng,markers);  
    }

    //makes a var to store the data and variables
    let earthquakeData = L.geoJSON(quakeData , {
        onEachFeature: quakePop,
        pointToLayer: magnitude
    });

    //loads map up
    createMap(earthquakeData);
}

// creating colors for depth of shocks based on data on a green->red shallow to deep range
function getColor(depth) {
    if (depth <= 10) return "#9900FF";
    else if (depth <= 30) return "#9900CC";
    else if (depth <= 50) return "#990099";
    else if (depth <= 70) return "#990066";
    else if (depth <= 90) return "#990033";
    else return "#FF4233";
}

//turns the map creation into a function for easier use
function createMap(earthquakeData) {
    
    //creates the tile layers from OSM data
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    //creating map object
    let mapData = L.map("map", {
        center: [
        38.62, -90.18
        ],
        zoom: 5,
        layers: [base, earthquakeData]
    });

    //creates the object that makes a magnitude legend
    let magnitudeLeg = L.control({position: "bottomright"});
    
    //adding values to legend
    magnitudeLeg.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let depth = [-10, 10, 30, 50, 70, 90];
        let title = ['<h3>Depth</h3>'];
    
        //adding colors and labels to legend
        for (let i = 0; i < depth.length; i++) {
            title.push('<ul style="background-color:' + getColor(depth[i] + 1) + '"> <span>' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></ul>');
        }

        div.innerHTML += "<ul>" + title.join("") + "</ul>";
        
        return div;
    };

    //adding legend to map
    magnitudeLeg.addTo(mapData);
};

