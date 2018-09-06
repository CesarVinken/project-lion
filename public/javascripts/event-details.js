$(document).ready(function() {
  const id = window.location.pathname.split("/")[2];

  $("#back").click(() => {
    window.location = "/events";
  });

  $("#attend").click(() => {
    window.location = `/events/attend/${id}`;
  });

  $("#unattend").click(() => {
    window.location = `/events/unattend/${id}`;
  });
});
