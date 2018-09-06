$(document).ready(function() {
  getLanguageList();
  getCountryList();

  // $(".tile-interactive").click(e => {
  //   window.location = `/tandem/${tandemId}`;
  // });

  if (user) {
    setUserLanguages();
    setUserCountry();
  }
});
