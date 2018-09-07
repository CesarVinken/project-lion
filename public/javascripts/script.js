$(document).ready(function() {
  $("#logo").click(() => {
    window.location = "/";
  });
  $(".ui.dropdown.nav").dropdown({
    onChange: val => {
      if (val === "profile") {
        window.location = "/profile";
      } else if (val === "logout") {
        window.location = "/logout";
      } else {
        console.log(`unknown route: ${val}`);
      }
    }
  });
});
