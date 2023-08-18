//createin the map object
let myMap = L.map("map", {
    center: [36.4681, -121.0458],
    zoom: 7,
    
});

//Adding layer to the title layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',   
      
  }).addTo(myMap);

//Set the Maker colors in a function
//used this site to make function https://leafletjs.com/examples/choropleth/
//used this iste to pick colors for map https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3
function getColor(d) {
  return  d > 90 ?'#7a0177':
          d > 70 ?'#c51b8a':
          d > 50 ?'#f768a1':
          d > 30 ?'#fa9fb5':
          d > 10 ?'#fcc5c0':
                  '#feebe2';
}

// Load the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data with d3.
d3.json(geoData).then(function(response) {

  //console log response
  console.log(response);

  //kind of making a directory so that in the response we know to 
  //go to features.  next we will tell it to go to geometry then coordinates 0 and 1
  //with depth being 2
  features = response.features;
  
  //set limit for number of markers to make if load faster
  let marker_limit = 2000


// Loop through the data array, and create one marker for each long/lat object.
for (let i = 0; i < marker_limit; i++) {

  //here we are going into response = response.feature.. location is
  //response.feature.geometry...  then we want coordinate 0 and 1
  let location = features[i].geometry;
  let depth = features[i].geometry;
  let magnitude = features[i].properties;
  
  if(location){
    L.circleMarker([location.coordinates[1], location.coordinates[0]],{
      radius: (magnitude.mag)*5,
      color: "black",
      weight: 1,
      fillColor: getColor([depth.coordinates[2]]),
      fillOpacity: 100,
      draggalbe: false
      
      ,
     //new Date changed the date from the ISO format to the normal date and time  
    }).bindPopup(`<h3>Location: ${magnitude.place}</h3><hr>
    <p>Date: ${new Date(magnitude.time)}</p>
    <p>Magnitude: ${magnitude.mag}</p>
    <p>Depth: ${location.coordinates[2]}</p>`)
    .addTo(myMap);
  }};

});


//legend - from https://leafletjs.com/examples/choropleth/


let legend = L.control({ position: "bottomright" });

legend.onAdd = function (myMap) {

  let div = L.DomUtil.create('div', 'info legend'), // create a div with a class "info"
    grades = [-10,10,30, 50, 70, 90];
    

    //This will give a title to the
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

// loop through our density intervals and generate a label with a colored square for each interval
for (let i = 0; i < grades.length; i++) {
  
  div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');

}

return div;

};

legend.addTo(myMap);




