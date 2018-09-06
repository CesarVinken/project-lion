function getCountryList() {
  let countries = `<option value="">Country</option>`;

  countryList.forEach(country => {
    countries += `<option class="item" data-value='${country}'>${country}</option>`;
  });

  $("#user-country").html(countries);
}

function getLanguageList() {
  let languageList = `<option value="">Select a language</option>`;

  for (const language in isoLangs) {
    languageList += `<option value='${language}'>${
      isoLangs[language].name
    }</option>`;
  }
  $("#multi-select-known").html(languageList);
  $("#multi-select-learning").html(languageList);
}

function getEventLanguageList() {
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

function setUserLanguages() {
  if (user.knownLanguages) {
    user.knownLanguages.forEach(language => {
      $("#multi-select-known").dropdown("set selected", language);
    });
  }
  if (user.learningLanguages) {
    user.learningLanguages.forEach(language => {
      $("#multi-select-learning").dropdown("set selected", language);
    });
  }
}

function setUserCountry() {
  if (user.location.country) {
    var userCountry = countryList.find(element => {
      return element === user.location.country;
    });
    $("#user-country").dropdown("set selected", userCountry);
  }
}

function setEventCountry() {
  if (data.event.location.country) {
    var userCountry = countryList.find(element => {
      return element === data.event.location.country;
    });
    $("#user-country").dropdown("set selected", userCountry);
  }
}
