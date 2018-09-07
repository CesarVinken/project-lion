$(document).ready(() => {
  start();
});

let events = [{ address: "Cologne", title: "test" }, { address: "Bonn", title: "test2" }];

function start() {
  geocoder = new google.maps.Geocoder();
  let address = "Berlin";

  const map = new google.maps.Map(document.getElementById("map"), { zoom: 12 });

  geocoder.geocode({ address }, function(results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
    } else {
      console.log("Geocode was not successful for the following reason: " + status);
    }
  });

  events.forEach(event => {
    geocoder.geocode({ address: event.address }, function(results, status) {
      if (status === "OK") {
        new google.maps.Marker({
          map: map,
          title: event.title,
          position: results[0].geometry.location
        });
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
  });
}
