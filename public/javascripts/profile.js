$(document).ready(function() {
  getLanguageList();
  getCountryList();

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

  setUserLanguages();
});

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

function getCountryList() {
  let countries = "";

  countryList.forEach(country => {
    countries += `<div class="item" data-value='${country}'>${country}</div>`;
  });

  $("#user-country").html(countries);
}

function setUserLanguages() {
  if (user) {
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
}
