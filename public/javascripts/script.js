$(document).ready(function() {
  $("#logo").click(() => {
    window.location = "/";
  });
  $(".ui.dropdown.nav").dropdown({
    onChange: val => {
      if (val === "profile") {
        window.location = "/profile";
      } else if (val === "logout") {
        window.location = "/logout";
      } else {
        console.log(`unknown route: ${val}`);
      }
    }
  });

  i18next.on("missingKey", function(lngs, namespace, key, res) {
    console.log(
      `Key ${key} missing for the language '${
        i18next.language
      }'. Please add a translation.`
    );
  });
});

i18next.init(
  {
    lng: "en",
    resources: {
      en: {},
      de: {}
    }
  },
  function(err, t) {
    jqueryI18next.init(i18next, $);

    const language = i18next.language;

    axios.get(`/l18n/${language}.json`).then(res => {
      localiseTexts(language, res);
    });
  }
);

function SetLanguage(language) {
  console.log("set language to " + language);

  i18next.changeLanguage(language, (err, t) => {
    if (err) return console.log("something went wrong loading", err);
    axios.get(`/l18n/${language}.json`).then(res => {
      localiseTexts(language, res);
    });
  });
}

function localiseTexts(language, strings) {
  i18next.addResourceBundle(language, "translation", strings.data, true, true);

  $("*").localize(); //it is also possible to load parts of the translation, by setting the right tag.
}
