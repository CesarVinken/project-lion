function getLanguageList() {
  let languageList = `<option value="">Select a language</option>`;

  for (const language in isoLangs) {
    languageList += `<option value='${isoLangs[language].name}'>${
      isoLangs[language].name
    }</option>`;
  }
  $("#multi-select-known").html(languageList);
  $("#multi-select-learning").html(languageList);
}

function getEventLanguageList() {
  let languageList = "";

  let firstLanguage = "English"; //if the user's known languages is empty, fall back to English
  if (data.user.knownLanguages.length > 0)
    firstLanguage = data.user.knownLanguages[0];

  for (const language in isoLangs) {
    if (isoLangs[language].name === firstLanguage) {
      languageList += `<option class="item" data-value='${
        isoLangs[language].name
      }' selected="selected">${isoLangs[language].name}</option>`;
    } else {
      languageList += `<option class="item" data-value='${
        isoLangs[language].name
      }'>${isoLangs[language].name}</option>`;
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
