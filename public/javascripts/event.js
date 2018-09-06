$(document).ready(function() {
  getEventLanguageList();
  getCountryList();

  //a new event does not yet have an event key, and will thus skip this step
  if (data.event) setEventCountry();
});
