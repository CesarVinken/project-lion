$(document).ready(function() {
  $(".tile-interactive.event").click(e => {
    window.location = `/events/${e.currentTarget.id}`;
  });

  $(".tile-interactive.tandem").click(e => {
    window.location = `/profile/${e.currentTarget.id}`;
  });
});
