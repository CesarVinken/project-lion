$(document).ready(function() {
  $("#logo").click(() => {
    window.location = "/";
  });
  $(".ui.dropdown").dropdown({
    onChange: val => {
      if (val === "profile") {
        window.location = "/profile";
      } else {
        window.location = "/logout";
      }
    }
  });
});
