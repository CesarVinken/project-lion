$(document).ready(function() {
  $("#logo").click(() => {
    window.location = "/";
  });
  $(".ui.dropdown").dropdown({
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

  $("#multi-select-known").dropdown({
    onChange: val => {
      console.log("known languages!");
      console.log(val);
    }
  });

  $("#multi-select-learning").dropdown({
    onChange: val => {
      console.log("learning languages!");
      console.log(val);
    }
  });
});
