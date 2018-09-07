$(document).ready(function() {
  const id = window.location.pathname.split("/")[2];

  $(".ui.dropdown.tandem").dropdown({
    onChange: val => {
      console.log(val);
      if (val === "more") {
        window.location = `/profile/${id}`;
      } else if (val === "block") {
        window.location = `/block/${id}`;
      } else {
        console.log(`unknown route: ${val}`);
      }
    }
  });
});
