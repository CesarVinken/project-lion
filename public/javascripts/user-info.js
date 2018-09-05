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

  //the user object should only be passed on on the edit pages.
  if (user) {
    setUserLanguages();
    setUserCountry();
  }
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
  let countries = `<option value="">Country</option>`;

  countryList.forEach(country => {
    countries += `<option class="item" data-value='${country}'>${country}</option>`;
  });

  $("#user-country").html(countries);
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

    console.log("The user lives in " + userCountry);
    $("#user-country").dropdown("set selected", userCountry);
  }
}
