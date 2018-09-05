$(document).ready(function() {
  $(".tile").click(e => {
    window.location = `/tandem/${tandemId}`;
  });
});
