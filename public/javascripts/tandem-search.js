$(document).ready(function() {
  getLanguageList();
  getCountryList();

  $(".tile").click(e => {
    window.location = `/tandem/${tandemId}`;
  });

  if (user) {
    setUserLanguages();
    setUserCountry();
  }
});
