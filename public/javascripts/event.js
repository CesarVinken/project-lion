$(document).ready(function() {
  getLanguageList();
  getCountryList();

  // let firstLanguage = "en";
  // if (user.knownLanguages.length > 0) firstLanguage = user.knownLanguages[0];
  $("#event-language").dropdown("set selected", "en");
});

function getCountryList() {
  let countries = "";

  countryList.forEach(country => {
    countries += `<div class="item" data-value='${country}'>${country}</div>`;
  });

  $("#user-country").html(countries);
}

function getLanguageList() {
  let languageList = "";

  for (const language in isoLangs) {
    if (language === "en") {
      languageList += `<div class="item" data-value='${language}' selected: true>${
        isoLangs[language].name
      }</div>`;
    } else {
      languageList += `<div class="item" data-value='${language}'>${
        isoLangs[language].name
      }</div>`;
    }
  }
  $("#event-language").html(languageList);
}
