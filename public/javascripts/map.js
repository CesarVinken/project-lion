$(document).ready(() => {
  start();
});

function start() {
  geocoder = new google.maps.Geocoder();
  let address = "Berlin";
  const map = new google.maps.Map(document.getElementById("map"), { zoom: 13 });

  geocoder.geocode({ address }, function(results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: map,
        title: event.title,
        position: results[0].geometry.location
      });
    } else {
      console.log("Geocode was not successful for the following reason: " + status);
    }
  });
}
