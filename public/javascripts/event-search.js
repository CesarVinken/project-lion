$(document).ready(function() {
  getLanguageList();
  getCountryList();

  $(".tile").click(e => {
    window.location = `/events/${eventId}`;
  });

  if (user) {
    setUserLanguages();
    setUserCountry();
  }
});
