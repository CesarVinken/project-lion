$(document).ready(function() {
  $(".tile").click(e => {
    window.location = `/events/${eventId}`;
  });
});
