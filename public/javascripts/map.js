document.addEventListener("DOMContentLoaded", start, false);

function start() {
  geocoder = new google.maps.Geocoder();
  let address = "Berlin";

  const map = new google.maps.Map(document.getElementById("map"), {});

  geocoder.geocode({ address }, function(results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
    } else {
      console.log("Geocode was not successful for the following reason: " + status);
    }
  });

  events.forEach(event => {
    geocoder.geocode({ address: address }, function(results, status) {
      if (status === "OK") {
        new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
  });
}
