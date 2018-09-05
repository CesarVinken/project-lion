$(document).ready(function() {
  getLanguageList();
  getCountryList();

  //a new event does not yet have an event key, and will thus skip this step
  if (data.event) setEventCountry();
});

function getCountryList() {
  let countries = `<option value="">Country</option>`;

  countryList.forEach(country => {
    countries += `<option class="item" data-value='${country}'>${country}</option>`;
  });

  $("#user-country").html(countries);
}

function getLanguageList() {
  let languageList = "";

  let firstLanguage = "en"; //if the user's known languages is empty, fall back to English
  if (data.user.knownLanguages.length > 0)
    firstLanguage = data.user.knownLanguages[0];

  for (const language in isoLangs) {
    if (language === firstLanguage) {
      languageList += `<option class="item" data-value='${language}' selected="selected">${
        isoLangs[language].name
      }</option>`;
    } else {
      languageList += `<option class="item" data-value='${language}'>${
        isoLangs[language].name
      }</option>`;
    }
  }
  $("#event-language").html(languageList);
}

function setEventCountry() {
  console.log(data.event);

  if (data.event.location.country) {
    var userCountry = countryList.find(element => {
      return element === data.event.location.country;
    });
    $("#user-country").dropdown("set selected", userCountry);
  }
}
